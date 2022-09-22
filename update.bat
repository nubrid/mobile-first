C: && cd "Program Files\nodejs"
move /Y .\node_modules\npm\npmrc .
npm install npm@latest
move /Y .\npmrc .\node_modules\npm\
D: && cd D:\Shared\Nubrid\Nubrid.Mobile\