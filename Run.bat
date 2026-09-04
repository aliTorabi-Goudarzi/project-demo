@echo off
chcp 65001 >nul
title وب‌سایت مهندسین مشاور ناجی سازان امین

if exist "%~dp0naji-sazan-amin" (
    cd /d "%~dp0naji-sazan-amin"
) else (
    cd /d "%~dp0"
)

:: بررسی وجود پایتون (python یا py)
python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    python serve.py
    goto :eof
)

py --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    py serve.py
    goto :eof
)

:: بررسی وجود npx
npx --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [✔] در حال اجرای سرور با Node...
    npx serve .
    goto :eof
)

:: باز کردن مستقیم فایل
echo [i] پایتون یافت نشد. باز کردن مستقیم در مرورگر...
start "" "index.html"
pause
