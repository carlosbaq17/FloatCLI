@echo off
echo ==============================================
echo Bienvenido al Instalador de FloatCLI (Windows)
echo ==============================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado o no esta en el PATH.
    echo Por favor, descarga e instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm no esta instalado.
    echo Por favor, instala Node.js que incluye npm.
    pause
    exit /b 1
)

echo Instalando dependencias del motor local...
cd "%~dp0native-host"
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al instalar las dependencias con npm.
    pause
    exit /b 1
)

set "TARGET_DIR=%~dp0native-host"
set "JSON_PATH=%TARGET_DIR%\com.floatcli.terminal.json"
set "BAT_PATH=%TARGET_DIR%\host.bat"

echo Generando host.bat dinamicamente...
echo @echo off > "%BAT_PATH%"
echo node "%%~dp0host.js" >> "%BAT_PATH%"

echo Generando com.floatcli.terminal.json...
set "BAT_PATH_ESCAPED=%BAT_PATH:\=\\%"

(
echo {
echo   "name": "com.floatcli.terminal",
echo   "description": "FloatCLI Native Host",
echo   "path": "%BAT_PATH_ESCAPED%",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://dnpbbaapeddlnjhkegdelipmhopkhgnj/"
echo   ]
echo }
) > "%JSON_PATH%"

echo Agregando clave de registro para Native Messaging...
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.floatcli.terminal" /ve /t REG_SZ /d "%JSON_PATH%" /f >nul

echo.
echo ==============================================
echo Instalacion completada con exito. Ya puedes usar la extension.
echo ==============================================
pause
