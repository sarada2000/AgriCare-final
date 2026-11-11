@echo off
REM Double-click this file to make the English, Sinhala and Tamil voice clips (needs Python and internet).
cd /d "%~dp0\.."
python -m pip install --upgrade edge-tts
python tools\make_voices.py
pause
