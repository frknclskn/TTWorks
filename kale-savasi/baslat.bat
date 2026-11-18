@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js bulunamadi. https://nodejs.org adresinden LTS surumunu kurun. & pause & exit /b)
if not exist node_modules (echo Ilk calistirma: paketler kuruluyor... & call npm install)
start "" http://localhost:8080
node sunucu.mjs
pause
