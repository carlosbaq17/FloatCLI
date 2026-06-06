$ErrorActionPreference = 'Stop'

$libsDir = "C:\Users\carlos.baquero\Documents\extension_cmd\vibe-terminal-workspace\extension\pip\libs"
if (-not (Test-Path $libsDir)) {
    New-Item -ItemType Directory -Force -Path $libsDir | Out-Null
}

Write-Host "Downloading xterm.js..."
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css" -OutFile "$libsDir\xterm.css"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.js" -OutFile "$libsDir\xterm.js"

Write-Host "Downloading xterm-addon-fit..."
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js" -OutFile "$libsDir\xterm-addon-fit.js"

Write-Host "Downloading winbox..."
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.js" -OutFile "$libsDir\winbox.bundle.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/css/winbox.min.css" -OutFile "$libsDir\winbox.min.css"

Write-Host "Setup Complete. Libraries downloaded to $libsDir."
