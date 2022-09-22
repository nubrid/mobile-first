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
call npm run ncu -- -u
call npm install
call npm prune

REM call log :i "npm: installing..."
REM cd /d "C:\Program Files\nodejs"
REM move /Y .\node_modules\npm\npmrc .
REM call npm install npm@latest
REM move /Y .\npmrc .\node_modules\npm\
REM cd /d %~dp0

REM call npm install -g cordova
REM call npm install -g grunt-cli
REM call npm install -g phonegap
