@echo off

REM Run Django app
echo Starting Django server...
start "" cmd /k "cd ./api/controller/ && python manage.py runserver"

REM Run Next.js app
echo Starting Next.js app...
cd path\to\your\nextjs\app
start "" cmd /k "cd ./ui/interface/ && npm start"

REM Open browser to localhost:3000
echo Waiting for Next.js to start...
timeout /t 10 /nobreak
start http://localhost:3000