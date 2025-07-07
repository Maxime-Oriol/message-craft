# ✅ Charger les variables d'environnement depuis un fichier .env
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]*)\s*=\s*(.*)\s*$") {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val)
        }
    }
}

# ✅ Définir des valeurs par défaut
$HOST = $env:HOST -or "0.0.0.0"
$PORT = $env:PORT -or "4000"
$APP_MODULE = $env:APP_MODULE -or "app.main:app"
$LOGFILE = $env:LOGFILE -or "logs/server.log"

# 📁 Créer le dossier logs si nécessaire
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# 🚀 Lancer le serveur avec uvicorn
Write-Host "🚀 Lancement de $APP_MODULE sur $HOST:$PORT"

uvicorn $APP_MODULE `
    --host $HOST `
    --port $PORT `
    --reload `
    --log-level info `
    --access-log `
    2>&1 | Tee-Object -FilePath $LOGFILE