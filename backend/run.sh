#!/bin/sh
# Start AgriCare (website + backend) at http://localhost:5000
cd "$(dirname "$0")"
python3 -m pip install -r requirements.txt
python3 app.py
