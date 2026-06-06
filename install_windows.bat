@echo off
echo ==============================================
echo Instalador de FloatCLI - Windows
echo ==============================================

set "TARGET_DIR=%~dp0native-host"
set "JSON_PATH=%TARGET_DIR%\com.floatcli.terminal.json"
set "BAT_PATH=%TARGET_DIR%\host.bat"

echo.
echo 1. Generando host.bat dinamicamente...
echo @echo off > "%BAT_PATH%"
echo node "%%~dp0host.js" >> "%BAT_PATH%"

echo.
echo 2. Generando com.floatcli.terminal.json...
set "BAT_PATH_ESCAPED=%BAT_PATH:\=\\%"

(
echo {
echo   "name": "com.floatcli.terminal",
echo   "description": "FloatCLI Native Host",
echo   "path": "%BAT_PATH_ESCAPED%",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://knkoaelddnffeppidielmdiongjijgfl/"
echo   ]
echo }
) > "%JSON_PATH%"

echo.
echo 3. Agregando clave de registro para Native Messaging...
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.floatcli.terminal" /ve /t REG_SZ /d "%JSON_PATH%" /f

echo.
echo ==============================================
echo Instalacion completada exitosamente.
echo Puedes cerrar esta ventana.
echo ==============================================
pause
