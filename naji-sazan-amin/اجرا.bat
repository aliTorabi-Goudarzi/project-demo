@echo off
chcp 65001 >nul
title اجرای لوکال وب‌سایت ناجی سازان امین

echo ========================================================
echo    در حال راه‌اندازی و اجرای لوکال وب‌سایت ناجی سازان امین...
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. بررسی وجود پایتون
python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [✔] پایتون روی سیستم شما شناسایی شد.
    echo [✔] سرور لوکال روی پورت 8000 آغاز به کار کرد...
    echo.
    echo آدرس دسترسی در مرورگر: http://localhost:8000
    echo برای اتمام کار، کافی است این پنجره خط فرمان را ببندید.
    echo.
    start "" powershell -NoProfile -Command "Start-Sleep -Milliseconds 600; Start-Process 'http://localhost:8000/index.html'"
    python -m http.server 8000
    goto :eof
)

:: 2. بررسی وجود Node / npx
npx --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [✔] نودجی‌اس شناسایی شد. در حال اجرای لوکال سرور...
    start "" powershell -NoProfile -Command "Start-Sleep -Milliseconds 800; Start-Process 'http://localhost:3000/index.html'"
    npx serve .
    goto :eof
)

:: 3. روش اضطراری مستقیم
echo [i] پایتون یا نود روی سیستم شناسایی نشد. در حال باز کردن مستقیم فایل در مرورگر...
start "" "%~dp0index.html"
