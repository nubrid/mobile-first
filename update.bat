call log :i "nginx: installing..."

rd /s /q D:\Shared\Downloads\nginx\
call npm run -s download -- --out D:/Shared/Downloads/ https://nginx.org/download/nginx-%~1.zip
call npm run -s 7z -- x D:/Shared/Downloads/nginx-%~1.zip -oD:/Shared/Downloads/nginx/ -xr!nginx.conf -y
xcopy D:\Shared\Downloads\nginx\nginx-%~1 .\Config\nginx\ /s /e /y
rd /s /q D:\Shared\Downloads\nginx\

call log :i "node: downloading..."
call npm run -s download -- --out D:/Shared/Downloads/ https://nodejs.org/dist/v%~2/node-v%~2-x64.msi
call log :i "node: installing..."
msiexec /qn /i D:\Shared\Downloads\node-v%~2-x64.msi /l* D:\Shared\Downloads\node-v%~2-x64.msi.log
call log :i "node: installing... 90s remaining..."
ping 127.0.0.1 -n 90 > nul

call log :i "npm: installing..."
C: && cd "Program Files\nodejs"
move /Y .\node_modules\npm\npmrc .
call npm install npm@latest
move /Y .\npmrc .\node_modules\npm\
D: && cd D:\Shared\Nubrid\Nubrid.Mobile\

call log :i "npm: updating packages..."
call npm run ncu -- -a -x /^imagemin-/
call npm update