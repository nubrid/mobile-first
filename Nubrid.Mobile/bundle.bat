call npm update
call npm run cecho "build libs: copy node_modules"
copy .\node_modules\backbone\backbone*.* .\src\js\libs\backbone\
copy .\node_modules\backbone.marionette\lib\backbone.marionette.* .\src\js\libs\backbone\
copy .\node_modules\backbone-react-component\dist\backbone-react-component.js .\src\js\libs\backbone\backbone.react.js
copy .\node_modules\backbone-react-component\dist\backbone-react-component-min.js .\src\js\libs\backbone\backbone.react-min.js
copy .\node_modules\jquery\dist\jquery.* .\src\js\libs\jquery\
:: copy .\node_modules\jquery-mobile\dist\jquery.mobile*.js .\src\js\libs\jquery\
:: copy .\node_modules\jquery-mobile\dist\jquery.mobile*.map .\src\js\libs\jquery\
copy .\node_modules\react\dist\react-with-addons.js .\src\js\libs\react\react.js
copy .\node_modules\react\dist\react-with-addons.min.js .\src\js\libs\react\react.min.js
copy .\node_modules\subschema\dist\subschema.* .\src\js\libs\react\
copy .\node_modules\underscore\underscore*.* .\src\js\libs\underscore\

call npm run cecho "build libs: download cdn"
call npm run download -- --out ./src/css/ https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css
call npm run download -- --out ./src/js/libs/jquery/ https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.js
call npm run download -- --out ./src/js/libs/jquery/ https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js
call npm run download -- --out ./src/js/libs/jquery/ https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.map
call npm run download -- --out ./src/js/libs/ http://www.nubrid.com/primus/primus.io.js
call npm run download -- --out ./src/js/libs/backbone/ https://raw.githubusercontent.com/noveogroup/backbone.iobind/master/dist/backbone.iobind.js
call npm run download -- --out ./src/js/libs/backbone/ https://raw.githubusercontent.com/noveogroup/backbone.iobind/master/dist/backbone.iosync.js
move .\src\css\jquery.mobile.min.css .\src\css\jquery.mobile.css

call npm run cecho "build libs: update paths"
call npm run replace -- images\/ ../img/ ./src/css/jquery.mobile.css

call npm run cecho "build libs: minify"
call npm run minify -- src/js/libs/primus.io.js -o src/js/libs/primus.io.min.js --source-map src/js/libs/primus.io.min.map -p relative -c -m
call npm run minify -- src/js/libs/backbone/backbone.iobind.js -o src/js/libs/backbone/backbone.iobind.min.js --source-map src/js/libs/backbone/backbone.iobind.map -p relative -c -m
call npm run minify -- src/js/libs/backbone/backbone.iosync.js -o src/js/libs/backbone/backbone.iosync.min.js --source-map src/js/libs/backbone/backbone.iosync.map -p relative -c -m
