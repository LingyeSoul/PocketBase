@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if not exist "dist\pocketbase.exe" (
    echo [ERROR] dist\pocketbase.exe was not found.
    echo Run build.bat first.
    exit /b 1
)

echo Starting PocketBase...
dist\pocketbase.exe serve %*
exit /b %errorlevel%