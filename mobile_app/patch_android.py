"""Run after 'flutter create .' (safe to run again):   python patch_android.py
- lets the app use the internet and talk to the laptop server over plain http (Android blocks http by default)
- lets the app open phone calls, WhatsApp, maps and the website (needed on Android 11+)"""
import re

PATH = "android/app/src/main/AndroidManifest.xml"
xml = open(PATH, encoding="utf-8").read()

if "android.permission.INTERNET" not in xml:
    xml = xml.replace("<application", '<uses-permission android:name="android.permission.INTERNET"/>\n    <application', 1)
if "usesCleartextTraffic" not in xml:
    xml = re.sub(r"<application\b", '<application\n        android:usesCleartextTraffic="true"', xml, count=1)
if "android.intent.action.DIAL" not in xml:
    links = """    <queries>
        <intent><action android:name="android.intent.action.VIEW"/><data android:scheme="https"/></intent>
        <intent><action android:name="android.intent.action.VIEW"/><data android:scheme="http"/></intent>
        <intent><action android:name="android.intent.action.DIAL"/><data android:scheme="tel"/></intent>
    </queries>
"""
    xml = xml.replace("</manifest>", links + "</manifest>", 1)

open(PATH, "w", encoding="utf-8").write(xml)
print("AndroidManifest.xml updated: internet, http, and links (call, WhatsApp, maps).")
