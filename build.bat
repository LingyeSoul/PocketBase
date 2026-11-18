@echo off
setlocal EnableExtensions
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm is required but was not found in PATH.
    exit /b 1
)

where go >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Go is required but was not found in PATH.
    exit /b 1
)

echo [1/3] Installing frontend dependencies...
call npm --prefix ui ci
if errorlevel 1 (
    echo [ERROR] Frontend dependency installation failed.
    exit /b 1
)

echo [2/3] Building frontend...
call npm --prefix ui run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed.
    exit /b 1
)

echo [3/3] Building PocketBase executable...
if not exist "dist" mkdir "dist"
set "CGO_ENABLED=0"
go build -trimpath -ldflags "-s -w" -o "dist\pocketbase.exe" ./examples/base
if errorlevel 1 (
    echo [ERROR] Executable build failed.
    exit /b 1
)

echo.
echo Build completed: "%CD%\dist\pocketbase.exe"
exit /b 0