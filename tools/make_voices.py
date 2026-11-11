"""
Make the English, Sinhala and Tamil voice clips for AgriCare (run once on your own computer, needs internet).

    pip install edge-tts
    python tools/make_voices.py

It reads voice/phrases.json and writes voice/en/*.mp3, voice/si/*.mp3, voice/ta/*.mp3 and voice/manifest.js
using Microsoft's free natural voices. Afterwards the website speaks Sinhala and Tamil on every
device, even offline. Re-running only makes clips whose text changed.
"""
import asyncio, json, os, sys

try:
    import edge_tts
except ImportError:
    sys.exit("Please run first:  pip install edge-tts")

# Change to the male voices if you prefer: si-LK-SameeraNeural, ta-LK-KumarNeural, en-IN-PrabhatNeural
VOICES = {"en": "en-IN-NeerjaNeural", "si": "si-LK-ThiliniNeural", "ta": "ta-LK-SaranyaNeural"}
RATE = "-8%"   # a little slower is easier for farmers to follow

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
VOICE_DIR = os.path.join(ROOT, "voice")


def djb2(text):
    """Same hash as AgriClips.hash in pages/treatment.js (UTF-16 code units)."""
    h = 5381
    data = text.encode("utf-16-le")
    for i in range(0, len(data), 2):
        h = ((h * 33) ^ (data[i] | (data[i + 1] << 8))) & 0xFFFFFFFF
    digits, n, out = "0123456789abcdefghijklmnopqrstuvwxyz", h, ""
    while True:
        n, r = divmod(n, 36)
        out = digits[r] + out
        if n == 0:
            return out


def load_manifest():
    path = os.path.join(VOICE_DIR, "manifest.js")
    if not os.path.exists(path):
        return {}
    raw = open(path, encoding="utf-8").read()
    try:
        return json.loads(raw[raw.index("{"): raw.rindex("}") + 1])
    except ValueError:
        return {}


async def make(lang, clip_id, text, sem, manifest, counts):
    out = os.path.join(VOICE_DIR, lang, clip_id + ".mp3")
    h = djb2(text)
    if manifest.get(lang, {}).get(clip_id) == h and os.path.exists(out):
        counts["skipped"] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICES[lang], rate=RATE).save(out)
                manifest.setdefault(lang, {})[clip_id] = h
                counts["made"] += 1
                print(f"  {lang}/{clip_id}.mp3")
                return
            except Exception as e:  # network hiccup: try again
                if attempt == 2:
                    counts["failed"] += 1
                    print(f"  FAILED {lang}/{clip_id}: {e}")
                await asyncio.sleep(2)


async def main():
    phrases = json.load(open(os.path.join(VOICE_DIR, "phrases.json"), encoding="utf-8"))
    manifest = load_manifest()
    counts = {"made": 0, "skipped": 0, "failed": 0}
    sem = asyncio.Semaphore(4)
    tasks = []
    for lang, items in phrases.items():
        os.makedirs(os.path.join(VOICE_DIR, lang), exist_ok=True)
        # forget clips that no longer exist in phrases.json
        manifest[lang] = {k: v for k, v in manifest.get(lang, {}).items() if k in items}
        for clip_id, text in items.items():
            tasks.append(make(lang, clip_id, text, sem, manifest, counts))
    await asyncio.gather(*tasks)
    with open(os.path.join(VOICE_DIR, "manifest.js"), "w", encoding="utf-8") as f:
        f.write("/* Made by tools/make_voices.py - do not edit */\nwindow.AGRI_VOICE_CLIPS = ")
        json.dump(manifest, f, ensure_ascii=False)
        f.write(";\n")
    print(f"\nDone: {counts['made']} made, {counts['skipped']} unchanged, {counts['failed']} failed.")
    if counts["failed"]:
        print("Run the script again to retry the failed clips.")


asyncio.run(main())
