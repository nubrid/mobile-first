rd /s /q D:\Shared\Downloads\nginx\
call npm run -s download -- --out D:/Shared/Downloads/ https://nginx.org/download/nginx-%1.zip
call npm run -s 7z -- x D:/Shared/Downloads/nginx-%1.zip -oD:/Shared/Downloads/nginx/ -xr!nginx.conf -y
xcopy D:\Shared\Downloads\nginx\nginx-%1 .\Config\nginx\ /s /e /y
rd /s /q D:\Shared\Downloads\nginx\

call npm run -s download -- --out D:/Shared/Downloads/ https://nodejs.org/dist/v%2/node-v%2-x64.msi
msiexec /qn /i D:\Shared\Downloads\node-v%2-x64.msi /l* D:\Shared\Downloads\node-v%2-x64.msi.log
ping 127.0.0.1 -n 90 > nul

C: && cd "Program Files\nodejs"
move /Y .\node_modules\npm\npmrc .
call npm install npm@latest
move /Y .\npmrc .\node_modules\npm\
D: && cd D:\Shared\Nubrid\Nubrid.Mobile\

call npm run ncu -- -a -x /^imagemin-/
call npm update