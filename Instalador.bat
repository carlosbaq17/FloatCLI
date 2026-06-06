@echo off
title Vibe Terminal PiP - Instalador
color 0b
powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"
if %errorlevel% neq 0 pause
