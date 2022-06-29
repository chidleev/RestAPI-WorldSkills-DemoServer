echo off
TASKLIST | FINDSTR "mysqld"
if %ERRORLEVEL%==0 (node server) else (echo "OpenServer not runnig!!!")
pause