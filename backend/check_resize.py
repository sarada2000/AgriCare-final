import json, os, random, sys
import numpy as np
from PIL import Image, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
MEAN = np.array([103.939, 116.779, 123.68], dtype=np.float32)
env = {}
for line in open(os.path.join(HERE, ".env"), encoding="utf-8"):
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1); env[k.strip()] = v.strip()
labels = json.load(open(os.path.join(HERE, "model", "labels.json"), encoding="utf-8"))
import tensorflow as tf
model = tf.keras.models.load_model(os.path.join(HERE, env["MODEL_PATH"]), compile=False)
data = sys.argv[1]; random.seed(3); samples = []
for i, name in enumerate(labels):
    folder = os.path.join(data, name)
    if not os.path.isdir(folder): continue
    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    for f in random.sample(files, min(20, len(files))):
        samples.append((os.path.join(folder, f), i))
print("Testing", len(samples), "photos...")
def pil_way(p):
    img = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    return np.asarray(img.resize((224, 224), Image.BILINEAR), dtype=np.float32)[..., ::-1] - MEAN
def tf_way(p):
    img = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    return tf.image.resize(np.asarray(img, dtype=np.float32), (224, 224)).numpy()[..., ::-1] - MEAN
y = np.array([c for _, c in samples])
for name, fn in (("server now (PIL resize)", pil_way), ("training way (TF resize)", tf_way)):
    p = model.predict(np.stack([fn(s) for s, _ in samples]), verbose=0, batch_size=16).argmax(1)
    print("%-26s accuracy %5.1f %%" % (name, (p == y).mean() * 100))
    for i, lab in enumerate(labels):
        m = y == i
        if m.any(): print("      %-26s %2d/%d" % (lab, (p[m] == i).sum(), m.sum()))
