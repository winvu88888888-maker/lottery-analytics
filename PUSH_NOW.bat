@echo off
chcp 65001 >nul
color 0A
title FIX AND PUSH

echo.
echo ================================================================
echo    DANG SUA DUONG DAN VA PUSH...
echo ================================================================
echo.

cd /d "c:\Users\HQSP\Desktop\ABCDEF"

echo Dang cap nhat remote URL...
git remote set-url origin https://github.com/winvu88888888-maker/lottery-analytics.git

echo.
echo Dang push...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo    PUSH THANH CONG!
    echo ================================================================
    echo.
    echo Dang mo trang cai dat GitHub Pages...
    start https://github.com/winvu88888888-maker/lottery-analytics/settings/pages
    echo.
    echo HUONG DAN:
    echo    1. O muc "Source" chon: GitHub Actions
    echo    2. Click Save
    echo    3. Cho 3-5 phut
    echo.
    echo Website cua ban se co tai:
    echo    https://winvu88888888-maker.github.io/lottery-analytics/
    echo.
) else (
    echo.
    echo Push that bai!
)

echo ================================================================
pause
