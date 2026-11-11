"""Paddy disease prediction.

Put your trained model in backend/model/ and set MODEL_PATH in backend/.env, for example:
    MODEL_PATH=model/paddy_model.keras      (TensorFlow/Keras: .keras or .h5)
    MODEL_PATH=model/paddy_model.tflite     (TensorFlow Lite)
    MODEL_PATH=model/paddy_model.onnx       (ONNX)
and list the class names, in the same order as the model's outputs, in backend/model/labels.json.

With no model, predictions run in DEMO mode: the result is a sample and is clearly marked "demo".
"""
import hashlib
import io
import json
import logging
import os

import numpy as np
from PIL import Image, ImageOps

log = logging.getLogger("agricare.model")

# Class ids the website knows (pages/diseases.js)
KNOWN = ["bacterial_leaf_blight", "blast", "brown_spot", "healthy", "red_stripe", "sheath_blight", "tungro"]
# Insect damage the model may also be trained on (shown with the pest's treatment plan)
PEST_IDS = ["gall_midge", "leaf_folder", "paddy_bug", "stem_borer", "brown_planthopper", "thrips", "green_leafhopper"]

# Names often used in public paddy datasets -> AgriCare ids
ALIASES = {
    "bacterialblight": "bacterial_leaf_blight", "bacterial_leaf_blight": "bacterial_leaf_blight",
    "bacterialleafblight": "bacterial_leaf_blight", "blb": "bacterial_leaf_blight", "bacterial_blight": "bacterial_leaf_blight",
    "blast": "blast", "leafblast": "blast", "leaf_blast": "blast", "riceblast": "blast", "neck_blast": "blast",
    "brownspot": "brown_spot", "brown_spot": "brown_spot",
    "sheathblight": "sheath_blight", "sheath_blight": "sheath_blight",
    "tungro": "tungro",
    "redstripe": "red_stripe", "red_stripe": "red_stripe", "red_streak": "red_stripe",
    "paddyblast": "blast", "paddy_blast": "blast", "rice_blast": "blast",
    "gallmidge": "gall_midge", "gall_midge": "gall_midge", "ricegallmidge": "gall_midge",
    "leaffolder": "leaf_folder", "leaf_folder": "leaf_folder", "leafroller": "leaf_folder", "riceleaffolder": "leaf_folder",
    "ricebug": "paddy_bug", "rice_bug": "paddy_bug", "paddybug": "paddy_bug", "paddy_bug": "paddy_bug",
    "stemborer": "stem_borer", "stem_borer": "stem_borer", "yellowstemborer": "stem_borer",
    "deadheart": "stem_borer", "whitehead": "stem_borer",
    "brownplanthopper": "brown_planthopper", "bph": "brown_planthopper",
    "healthy": "healthy", "normal": "healthy", "healthyleaf": "healthy", "healthy_leaf": "healthy",
}


def to_agricare_id(name):
    key = str(name).strip().lower().replace(" ", "_").replace("-", "_")
    return ALIASES.get(key) or ALIASES.get(key.replace("_", "")) or key


class Predictor:
    def __init__(self, config, base_dir):
        self.cfg = config
        self.base_dir = base_dir
        self.kind = None          # keras / tflite / onnx / None (demo)
        self.model = None
        self.labels = list(KNOWN)
        self.input_size = (config["MODEL_INPUT_SIZE"], config["MODEL_INPUT_SIZE"])
        self.channels_first = False
        self.load_error = None
        self._load()

    # ---------- loading ----------
    def _load(self):
        labels_path = self.cfg["MODEL_LABELS"]
        if not os.path.isabs(labels_path):
            labels_path = os.path.join(self.base_dir, labels_path)
        if os.path.exists(labels_path):
            with open(labels_path, encoding="utf-8") as f:
                self.labels = [to_agricare_id(x) for x in json.load(f)]

        path = self.cfg["MODEL_PATH"]
        if not path:
            log.warning("No MODEL_PATH set: predictions run in DEMO mode.")
            return
        if not os.path.isabs(path):
            path = os.path.join(self.base_dir, path)
        if not os.path.exists(path):
            self.load_error = f"Model file not found: {path}"
            log.error(self.load_error + " - running in DEMO mode.")
            return
        ext = os.path.splitext(path)[1].lower()
        try:
            if ext in (".keras", ".h5"):
                import tensorflow as tf  # noqa: import only when needed
                self.model = tf.keras.models.load_model(path, compile=False)
                shape = self.model.input_shape
                self._set_size(shape)
                self.kind = "keras"
            elif ext == ".tflite":
                try:
                    from tflite_runtime.interpreter import Interpreter
                except ImportError:
                    from tensorflow.lite import Interpreter
                self.model = Interpreter(model_path=path)
                self.model.allocate_tensors()
                self._set_size(self.model.get_input_details()[0]["shape"])
                self.kind = "tflite"
            elif ext == ".onnx":
                import onnxruntime as ort
                self.model = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
                self._set_size(self.model.get_inputs()[0].shape)
                self.kind = "onnx"
            else:
                raise ValueError("Unsupported model type " + ext)
        except Exception as e:  # keep the server running in demo mode
            self.model, self.kind = None, None
            self.load_error = f"Could not load model: {e}"
            log.exception(self.load_error)
            return

        unknown = [l for l in self.labels if l not in KNOWN and l not in PEST_IDS]
        if unknown:
            log.warning("Labels not in the AgriCare disease library: %s", unknown)
        log.info("Loaded %s model %s, input %s, %d classes", self.kind, path, self.input_size, len(self.labels))

    def _set_size(self, shape):
        dims = [d if isinstance(d, int) else None for d in list(shape)]
        if len(dims) == 4:
            if dims[1] in (1, 3) and dims[3] not in (1, 3):     # NCHW
                self.channels_first = True
                h, w = dims[2], dims[3]
            else:                                              # NHWC
                h, w = dims[1], dims[2]
            if h and w:
                self.input_size = (int(h), int(w))

    @property
    def demo(self):
        return self.model is None

    def info(self):
        return {"mode": "demo" if self.demo else self.kind, "classes": self.labels,
                "inputSize": list(self.input_size), "error": self.load_error}

    # ---------- prediction ----------
    @staticmethod
    def open_image(data):
        img = Image.open(io.BytesIO(data))
        img = ImageOps.exif_transpose(img)        # phone photos are often rotated
        return img.convert("RGB")

    def _prepare(self, img):
        h, w = self.input_size
        if self.kind == "keras":
            # shrink the photo exactly like the training notebook (tf.image.resize)
            import tensorflow as tf
            arr = tf.image.resize(np.asarray(img, dtype=np.float32), (h, w)).numpy()
        else:
            arr = np.asarray(img.resize((w, h), Image.BILINEAR), dtype=np.float32)
        mode = self.cfg["MODEL_NORMALIZE"]
        if mode == "0-1":
            arr = arr / 255.0
        elif mode == "-1-1":
            arr = arr / 127.5 - 1.0
        elif mode == "resnet":
            # same as tf.keras.applications.resnet50.preprocess_input ("caffe" style):
            # RGB -> BGR, then subtract the ImageNet mean of each channel
            arr = arr[..., ::-1] - np.array([103.939, 116.779, 123.68], dtype=np.float32)
        if self.channels_first:
            arr = arr.transpose(2, 0, 1)
        return arr[None, ...]

    def _run(self, x):
        if self.kind == "keras":
            return np.asarray(self.model.predict(x, verbose=0))[0]
        if self.kind == "tflite":
            inp = self.model.get_input_details()[0]
            out = self.model.get_output_details()[0]
            if inp["dtype"] == np.uint8:                       # quantised model
                scale, zero = inp["quantization"]
                x = (x / scale + zero).astype(np.uint8) if scale else x.astype(np.uint8)
            self.model.set_tensor(inp["index"], x.astype(inp["dtype"]))
            self.model.invoke()
            y = self.model.get_tensor(out["index"])[0].astype(np.float32)
            if out["dtype"] == np.uint8:
                scale, zero = out["quantization"]
                y = (y - zero) * scale
            return y
        if self.kind == "onnx":
            name = self.model.get_inputs()[0].name
            return np.asarray(self.model.run(None, {name: x.astype(np.float32)})[0])[0]
        raise RuntimeError("no model")

    @staticmethod
    def _softmax_if_needed(y):
        y = np.asarray(y, dtype=np.float64).ravel()
        if y.min() < 0 or abs(y.sum() - 1.0) > 0.01:          # logits -> probabilities
            e = np.exp(y - y.max())
            y = e / e.sum()
        return y

    def predict(self, image_bytes):
        img = self.open_image(image_bytes)
        if self.demo:
            return self._demo(image_bytes)
        probs = self._softmax_if_needed(self._run(self._prepare(img)))
        if len(probs) != len(self.labels):
            raise RuntimeError(f"Model gives {len(probs)} outputs but labels.json has {len(self.labels)} names.")
        order = np.argsort(probs)[::-1]
        top = [{"label": self.labels[i], "confidence": round(float(probs[i]), 4)} for i in order[:3]]
        best = top[0]
        return {"label": best["label"], "confidence": best["confidence"], "top": top, "demo": False,
                "uncertain": best["confidence"] < self.cfg["MIN_CONFIDENCE"]}

    def _demo(self, image_bytes):
        """Sample result (same photo -> same result). NOT a real diagnosis."""
        h = int(hashlib.sha256(image_bytes).hexdigest(), 16)
        label = KNOWN[h % len(KNOWN)]
        conf = round(0.82 + (h % 15) / 100, 2)
        others = [k for k in KNOWN if k != label][:2]
        rest = round((1 - conf) / 2, 2)
        top = [{"label": label, "confidence": conf}] + [{"label": o, "confidence": rest} for o in others]
        return {"label": label, "confidence": conf, "top": top, "demo": True, "uncertain": False}


# Model class names that mean "this is not a paddy leaf" (add such a class when you retrain the model)
NOT_PADDY = {"not_paddy", "notpaddy", "other", "others", "other_plant", "other_leaf", "not_rice", "background", "unknown"}

# A paddy leaf photo is mostly plant colour (green to yellow-green). The model only knows paddy classes,
# so a photo of something else (a face, a wall, a document) is stopped before it gets a disease name.
LEAF_MIN_SHARE = 0.35


def plant_share(img):
    """Share of pixels that are plant-coloured: hue 35-170 degrees, saturation >= 0.18, brightness >= 0.15."""
    hsv = np.asarray(img.convert("RGB").resize((64, 64)).convert("HSV"), dtype=np.float32)
    h, s, v = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    return float(((h >= 35) & (h <= 170) & (s >= 0.18) & (v >= 0.15)).mean())


def make_thumbnail(img, size=320):
    t = img.copy()
    t.thumbnail((size, size))
    buf = io.BytesIO()
    t.save(buf, "JPEG", quality=70)
    return buf.getvalue()
