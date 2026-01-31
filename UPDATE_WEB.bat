@echo off
chcp 65001 >nul
color 0A
title UPDATE WEBSITE

echo.
echo ================================================================
echo    DANG CAP NHAT WEBSITE...
echo ================================================================
echo.

cd /d "c:\Users\HQSP\Desktop\ABCDEF"

echo Dang them file thay doi...
git add -A

echo Dang commit...
git commit -m "Update: Show all history data without pagination"

echo.
echo Dang push len GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo    CAP NHAT THANH CONG!
    echo ================================================================
    echo.
    echo Website da duoc cap nhat. Cho 1-2 phut de thay doi co hieu luc.
    echo.
    echo Mo website de kiem tra:
    start https://winvu88888888-maker.github.io/lottery-analytics/
    echo.
) else (
    echo.
    echo Cap nhat that bai!
)

echo ================================================================
pause
