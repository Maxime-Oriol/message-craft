@echo off
setlocal

:: Charger les variables depuis le .env
for /f "usebackq tokens=1,* delims==" %%i in (.env) do (
    set "%%i=%%j"
)

:: Définir les valeurs par défaut si non définies
if not defined HOST set HOST=0.0.0.0
if not defined PORT set PORT=4000
if not defined APP_MODULE set APP_MODULE=app.main:app
if not defined LOGFILE set LOGFILE=logs\server.log

:: Créer le dossier logs s'il n'existe pas
if not exist logs (
    mkdir logs
)

echo 🚀 Lancement de %APP_MODULE% sur %HOST%:%PORT%

:: Lancer uvicorn
uvicorn %APP_MODULE% --host %HOST% --port %PORT% --reload --log-level info --access-log >> %LOGFILE% 2>&1