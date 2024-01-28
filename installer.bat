@echo off

REM downloading python dependencies
echo Downloading python dependencies...
start "" cmd /k "cd ./api/controller/ && pip install -r requirements.txt"

REM downloading node dependencies
echo Downloading dependencies...
cd path\to\your\nextjs\app
start "" cmd /k "cd ./ui/interface/ && npm install"