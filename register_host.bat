@echo off
echo Registrando Native Messaging Host para Vibe Terminal PiP...
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.vibe.terminal" /ve /t REG_SZ /d "C:\Users\carlos.baquero\Documents\extension_cmd\vibe-terminal-workspace\native-host\com.vibe.terminal.json" /f
echo.
echo Registro completado. 
echo RECUERDA: Debes actualizar com.vibe.terminal.json con el ID de la extension de Chrome antes de probarlo.
pause
