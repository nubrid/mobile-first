call log :i "version: retrieving..."
for /f %%i in ('npm run -s scrape:node ^| npm run -s json -- version') do set node=%%i
for /f %%i in ('npm run -s scrape:nginx ^| npm run -s json -- version') do set nginx=%%i
call log :i "version: node-%node% %nginx%"

call log :i "nginx: installing..."

rd /s /q ..\..\Downloads\nginx\
call npm run -s download -- --out ../../Downloads/ https://nginx.org/download/%nginx%.zip
call npm run -s 7z -- x ../../Downloads/%nginx%.zip -o../../Downloads/nginx/ -xr!nginx.conf -y
xcopy ..\..\Downloads\nginx\%nginx% .\Config\nginx\ /s /e /y
rd /s /q ..\..\Downloads\nginx\

call log :i "node: downloading..."
call npm run -s download -- --out ../../Downloads/ https://nodejs.org/dist/v%node%/node-v%node%-x64.msi
call log :i "node: installing..."
cd ..\..
msiexec /qn /i Downloads\node-v%node%-x64.msi /l* Downloads\node-v%node%-x64.msi.log
cd /d %~dp0

call log :i "node: installing... 90s remaining..."
ping 127.0.0.1 -n 90 > nul

call log :i "npm: updating packages..."
call npm run ncu -- -a
call npm install
call npm prune

call log :i "npm: installing..."
cd /d "C:\Program Files\nodejs"
move /Y .\node_modules\npm\npmrc .
call npm install npm@latest
move /Y .\npmrc .\node_modules\npm\
cd /d %~dp0