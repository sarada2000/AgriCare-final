import os, shutil
p = "model_service.py"
s = open(p, encoding="utf-8").read()
old = "        arr = np.asarray(img.resize((w, h), Image.BILINEAR), dtype=np.float32)\n"
new = ("        if self.kind == \"keras\":\n"
       "            # shrink the photo exactly like the training notebook (tf.image.resize)\n"
       "            import tensorflow as tf\n"
       "            arr = tf.image.resize(np.asarray(img, dtype=np.float32), (h, w)).numpy()\n"
       "        else:\n"
       "            arr = np.asarray(img.resize((w, h), Image.BILINEAR), dtype=np.float32)\n")
if "tf.image.resize" in s:
    print("Already fixed.")
elif old in s:
    shutil.copy(p, p + ".bak")
    open(p, "w", encoding="utf-8").write(s.replace(old, new, 1))
    print("Fixed. Backup saved as model_service.py.bak")
else:
    print("Could not find the resize line - send model_service.py to Claude.")
