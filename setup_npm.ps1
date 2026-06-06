$ErrorActionPreference = 'Stop'
$extDir = "C:\Users\carlos.baquero\Documents\extension_cmd\vibe-terminal-workspace\extension"
$libsDir = "$extDir\pip\libs"

if (-not (Test-Path $libsDir)) {
    New-Item -ItemType Directory -Force -Path $libsDir | Out-Null
}

Set-Location $extDir
npm init -y | Out-Null
npm i xterm xterm-addon-fit winbox | Out-Null

Copy-Item "node_modules\xterm\css\xterm.css" -Destination $libsDir -Force
Copy-Item "node_modules\xterm\lib\xterm.js" -Destination $libsDir -Force
Copy-Item "node_modules\xterm-addon-fit\lib\xterm-addon-fit.js" -Destination $libsDir -Force
Copy-Item "node_modules\winbox\dist\winbox.bundle.min.js" -Destination "$libsDir\winbox.bundle.js" -Force
Copy-Item "node_modules\winbox\dist\css\winbox.min.css" -Destination $libsDir -Force

Write-Host "Libraries installed and copied successfully."
