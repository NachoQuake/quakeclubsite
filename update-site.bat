@echo off
cd /d "%~dp0"
echo ================================
echo   🚀 ACTUALIZANDO QUAKECLUB...
echo ================================
echo.

:: pedir comentario al usuario
set /p comment=💬 Ingresa un comentario para el commit: 

echo.
echo ================================
echo Commit message: "%comment%"
echo ================================
echo.

git add .
git commit -m "%comment%"
git push origin main

echo.
echo ✅ Deploy enviado a Netlify.
echo Espera unos segundos para que aparezca en:
echo https://quakeclub.netlify.app
echo.
pause