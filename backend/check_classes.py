import json, os, random, sys
import numpy as np
from PIL import Image, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
env = {}
for line in open(os.path.join(HERE, ".env"), encoding="utf-8"):
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1); env[k.strip()] = v.strip()
labels = json.load(open(os.path.join(HERE, "model", "labels.json"), encoding="utf-8"))
import tensorflow as tf
model = tf.keras.models.load_model(os.path.join(HERE, env["MODEL_PATH"]), compile=False)
print("Model outputs:", model.output_shape[-1], " labels.json names:", len(labels))
data = sys.argv[1]; random.seed(2)
print("Folders in data:", sorted(os.listdir(data)))
for i, name in enumerate(labels):
    folder = os.path.join(data, name)
    if not os.path.isdir(folder): continue
    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    imgs = []
    for f in random.sample(files, min(20, len(files))):
        a = np.asarray(ImageOps.exif_transpose(Image.open(os.path.join(folder, f))).convert("RGB").resize((224, 224), Image.BILINEAR), dtype=np.float32)
        imgs.append(a[..., ::-1] - np.array([103.939, 116.779, 123.68], dtype=np.float32))
    p = model.predict(np.stack(imgs), verbose=0).argmax(1)
    counts = np.bincount(p, minlength=len(labels))
    most = counts.argmax()
    print("%-26s correct %2d/%d   most often called: %s (%d)" % (name, counts[i], len(imgs), labels[most], counts[most]))
