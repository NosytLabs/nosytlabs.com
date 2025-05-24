@echo off
echo Installing admin API dependencies...
cd public\admin\api
call npm install

echo Starting admin API server...
start cmd /k "npm start"

echo Opening admin dashboard...
cd ..\..\..
start http://localhost:3000/admin/