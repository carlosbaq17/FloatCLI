$ErrorActionPreference = 'Stop'

$workspace = $PSScriptRoot
$extDir = "$workspace\extension"
$nativeHostDir = "$workspace\native-host"
$manifestPath = "$nativeHostDir\com.vibe.terminal.json"

Clear-Host
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Instalador de Vibe Terminal PiP" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Verificando y preparando el Frontend..." -ForegroundColor Yellow
$libsDir = "$extDir\pip\libs"
if (-not (Test-Path "$libsDir\xterm.js")) {
    Write-Host "      Descargando dependencias del frontend..." -ForegroundColor DarkGray
    Set-Location $extDir
    npm install xterm xterm-addon-fit winbox | Out-Null
    Copy-Item "node_modules\xterm\css\xterm.css" -Destination $libsDir -Force
    Copy-Item "node_modules\xterm\lib\xterm.js" -Destination $libsDir -Force
    Copy-Item "node_modules\xterm-addon-fit\lib\xterm-addon-fit.js" -Destination $libsDir -Force
    Copy-Item "node_modules\winbox\dist\winbox.bundle.min.js" -Destination "$libsDir\winbox.bundle.js" -Force
    Copy-Item "node_modules\winbox\dist\css\winbox.min.css" -Destination $libsDir -Force
}
Write-Host "      Frontend listo." -ForegroundColor Green

Write-Host ""
Write-Host "[2/4] Verificando dependencias del Backend (Node.js)..." -ForegroundColor Yellow
if (-not (Test-Path "$nativeHostDir\node_modules\node-pty")) {
    Write-Host "      Instalando node-pty (esto puede tardar unos segundos)..." -ForegroundColor DarkGray
    Set-Location $nativeHostDir
    npm install | Out-Null
}
Write-Host "      Backend listo." -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Enlace con Google Chrome" -ForegroundColor Yellow
Write-Host "      Para que el terminal funcione, Chrome necesita conocerlo."
Write-Host "      1. Abre Chrome y ve a la URL: chrome://extensions/"
Write-Host "      2. Activa el 'Modo de desarrollador' (arriba a la derecha)."
Write-Host "      3. Haz clic en 'Cargar descomprimida' y selecciona esta carpeta:"
Write-Host "         $extDir"
Write-Host "      4. Copia el 'ID' que Chrome le ha asignado a la extension."
Write-Host ""

$extId = Read-Host "Pega el ID de la extension aqui y presiona Enter"

if ([string]::IsNullOrWhiteSpace($extId) -or $extId.Length -ne 32) {
    Write-Host "Error: El ID debe tener exactamente 32 caracteres. Reintenta la instalacion." -ForegroundColor Red
    Start-Sleep -Seconds 5
    exit
}

Write-Host ""
Write-Host "[4/4] Configurando Permisos de Native Messaging..." -ForegroundColor Yellow
$jsonContent = Get-Content $manifestPath -Raw
$jsonContent = $jsonContent -replace "chrome-extension://[^/]+/", "chrome-extension://$extId/"
$jsonContent = $jsonContent -replace "<PLACEHOLDER_EXTENSION_ID>", $extId
Set-Content -Path $manifestPath -Value $jsonContent
Write-Host "      Manifiesto local actualizado." -ForegroundColor Green

$regPath = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.vibe.terminal"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}
Set-ItemProperty -Path $regPath -Name "(default)" -Value "$manifestPath"
Write-Host "      Registro de Windows actualizado." -ForegroundColor Green

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   INSTALACION COMPLETADA CON EXITO" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Instrucciones de uso:"
Write-Host "1. Abre Chrome y ancla (pin) el icono de Vibe Terminal en tu barra."
Write-Host "2. Haz clic en el para abrir el Launcher."
Write-Host "3. Haz clic en 'Abrir Terminal Flotante'."
Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
