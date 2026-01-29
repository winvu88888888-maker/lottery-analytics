@echo off
cd /d "%~dp0"
echo Dang chuan bi tai len GitHub...
git init
git add .
git commit -m "Web analysis setup"
git branch -M main
echo.
echo === QUAN TRONG ===
echo Hay copy link GitHub ma ban vua tao (vidu: https://github.com/ten-cua-ban/cuongtanVL.git)
echo va dan vao day roi nhan ENTER:
set /p giturl=Link cua ban: 
git remote add origin %giturl%
git push -u origin main --force
echo.
echo === HOAN THANH ===
echo Bay gio ban chi can vao Settings -> Pages tren GitHub de nhan Link web!
pause
