import json, os, random, sys
import numpy as np
from PIL import Image, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
env = {}
for line in open(os.path.join(HERE, ".env"), encoding="utf-8"):
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1); env[k.strip()] = v.strip()
labels = json.load(open(os.path.join(HERE, "model", "labels.json"), encoding="utf-8"))
size = int(env.get("MODEL_INPUT_SIZE", "224"))
print("Classes:", labels)
print("Now in .env: MODEL_NORMALIZE =", env.get("MODEL_NORMALIZE"))
import tensorflow as tf
model = tf.keras.models.load_model(os.path.join(HERE, env["MODEL_PATH"]), compile=False)
data = sys.argv[1]; random.seed(1); samples = []
for i, name in enumerate(labels):
    folder = os.path.join(data, name)
    if not os.path.isdir(folder):
        print("No folder for", name); continue
    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    for f in random.sample(files, min(15, len(files))):
        samples.append((ImageOps.exif_transpose(Image.open(os.path.join(folder, f))).convert("RGB"), i))
print("Testing", len(samples), "photos...")
def prep(img, mode):
    a = np.asarray(img.resize((size, size), Image.BILINEAR), dtype=np.float32)
    if mode == "0-1": a = a / 255.0
    elif mode == "-1-1": a = a / 127.5 - 1.0
    elif mode == "resnet": a = a[..., ::-1] - np.array([103.939, 116.779, 123.68], dtype=np.float32)
    return a
y = np.array([c for _, c in samples]); res = {}
for mode in ["none", "0-1", "-1-1", "resnet"]:
    p = np.asarray(model.predict(np.stack([prep(im, mode) for im, _ in samples]), verbose=0, batch_size=16))
    res[mode] = float((p.argmax(1) == y).mean())
    print("MODEL_NORMALIZE=%-7s accuracy %5.1f %%" % (mode, res[mode] * 100))
print("BEST: MODEL_NORMALIZE=" + max(res, key=res.get))
