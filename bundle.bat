call npm prune
call npm update
call npm update -g phonegap
call npm update -g cordova
call cordova platform remove android
call cordova platform add android
REM call cordova plugin remove cordova-plugin-crosswalk-webview
REM call cordova plugin add cordova-plugin-crosswalk-webview
call cordova plugin remove cordova-plugin-dialogs
call cordova plugin add cordova-plugin-dialogs
call cordova plugin remove cordova-plugin-inappbrowser
call cordova plugin add cordova-plugin-inappbrowser
call cordova plugin remove cordova-plugin-network-information
call cordova plugin add cordova-plugin-network-information
call cordova plugin remove cordova-plugin-whitelist
call cordova plugin add cordova-plugin-whitelist
call cordova plugin remove com.telerik.plugins.nativepagetransitions
call cordova plugin add com.telerik.plugins.nativepagetransitions
:: call cordova plugin remove com.phonegap.plugins.facebookconnect
:: call cordova plugin add com.phonegap.plugins.facebookconnect --save --variable APP_ID="XXXXXXXXXXXXXXX" --variable APP_NAME="nubrid"

call log :i "build libs: copy node_modules"
cd .\node_modules\modernizr && call npm install && cd ..\..
call npm run -s modernizr -- -c modernizr-config.json -d src/js/libs/modernizr.min.js

copy /Y .\node_modules\backbone\backbone*.* .\src\js\libs\backbone\
copy /Y .\node_modules\backbone.marionette\lib\backbone.marionette.* .\src\js\libs\backbone\
copy /Y .\node_modules\backbone-pouch\backbone-pouch.js .\src\js\libs\backbone\backbone.pouchdb.js
REM copy /Y .\node_modules\backbone-react-component\dist\backbone-react-component.js .\src\js\libs\backbone\backbone.react.js
REM copy /Y .\node_modules\backbone-react-component\dist\backbone-react-component-min.js .\src\js\libs\backbone\backbone.react-min.js
:: copy /Y .\node_modules\immutable-backbone\index.js .\src\js\libs\backbone\backbone.immutable.js
call npm run -s babel -- node_modules/immutable-backbone/index.js -o src/js/libs/backbone/backbone.immutable.js

call bundle.custom.bat
copy /Y .\dist\jquery\dist\jquery.* .\src\js\libs\jquery\
copy /Y .\dist\jquery.mobile\dist\jquery.mobile*.js .\src\js\libs\jquery\
copy /Y .\dist\jquery.mobile\dist\jquery.mobile*.map .\src\js\libs\jquery\
copy /Y .\dist\jquery.mobile\dist\css\*.* .\src\css\
copy /Y .\dist\jquery.mobile\dist\img\*.* .\src\img\
copy /Y .\dist\jquery.mobile\dist\images\ajax-loader.gif .\src\img\
copy /Y .\dist\jquery.mobile\dist\jquery.mobile.theme.css .\src\css\
copy /Y .\dist\jquery.mobile\dist\jquery.mobile.structure.css .\src\css\

copy /Y .\node_modules\pouchdb\dist\pouchdb.js .\src\js\libs\pouchdb\pouchdb.js
copy /Y .\node_modules\pouchdb\dist\pouchdb.min.js .\src\js\libs\pouchdb\pouchdb.min.js
copy /Y .\node_modules\socket-pouch\dist\socket-pouch.client.js .\src\js\libs\pouchdb\pouchdb.socket.js
set arg=npm run -s replace -- "(api\._socket = new )Socket\(" "$1opts.Socket(" src/js/libs/pouchdb/pouchdb.socket.js && call run arg
:: copy /Y .\node_modules\socket-pouch\dist\socket-pouch.client.min.js .\src\js\libs\pouchdb\pouchdb.socket.min.js

copy /Y .\node_modules\react\dist\react-with-addons.js .\src\js\libs\react\react.js
copy /Y .\node_modules\react\dist\react-with-addons.min.js .\src\js\libs\react\react.min.js
copy /Y .\node_modules\react-dom\dist\react-dom.js .\src\js\libs\react\react.dom.js
copy /Y .\node_modules\react-dom\dist\react-dom.min.js .\src\js\libs\react\react.dom.min.js
copy /Y .\node_modules\subschema\dist\subschema.* .\src\js\libs\react\
move /Y .\src\js\libs\react\subschema.js .\src\js\libs\react\subschema.min.js
copy /Y .\node_modules\underscore\underscore*.* .\src\js\libs\underscore\

call log :i "build libs: download cdn"
call npm run -s download -- --out src/js/libs/ http://www.nubrid.com/primus/primus.io.js
call npm run -s download -- --out src/js/libs/backbone/ https://raw.githubusercontent.com/noveogroup/backbone.iobind/master/dist/backbone.iobind.js
call npm run -s download -- --out src/js/libs/backbone/ https://raw.githubusercontent.com/noveogroup/backbone.iobind/master/dist/backbone.iosync.js
call npm run -s download -- https://raw.githubusercontent.com/magalhas/backbone-react-component/master/dist/backbone-react-component.js > src/js/libs/backbone/backbone.react.js
call npm run -s download -- https://raw.githubusercontent.com/magalhas/backbone-react-component/master/dist/backbone-react-component-min.js > src/js/libs/backbone/backbone.react-min.js
:: call npm run -s download -- --out src/js/libs/require/ https://raw.githubusercontent.com/requirejs/text/latest/text.js

call log :i "build libs: update paths"
call npm run -s replace -- images\/ ../img/ src/css/jquery.mobile.theme.css

call log :i "build libs: minify"
call npm run -s uglifyjs -- src/js/libs/backbone/backbone.immutable.js -o src/js/libs/backbone/backbone.immutable.min.js -p relative -c -m --source-map
call npm run -s uglifyjs -- src/js/libs/backbone/backbone.pouchdb.js -o src/js/libs/backbone/backbone.pouchdb.min.js -p relative -c -m --source-map
call npm run -s uglifyjs -- src/js/libs/pouchdb/pouchdb.socket.js -o src/js/libs/pouchdb/pouchdb.socket.min.js -p relative -c -m --source-map
call npm run -s uglifyjs -- src/js/libs/primus.io.js -o src/js/libs/primus.io.min.js -p relative -c -m --source-map
call npm run -s uglifyjs -- src/js/libs/backbone/backbone.iobind.js -o src/js/libs/backbone/backbone.iobind.min.js -p relative -c -m --source-map
:: --source-map src/js/libs/backbone/backbone.iobind.map
call npm run -s uglifyjs -- src/js/libs/backbone/backbone.iosync.js -o src/js/libs/backbone/backbone.iosync.min.js -p relative -c -m --source-map
:: --source-map src/js/libs/backbone/backbone.iosync.map
call npm run -s uglifyjs -- node_modules/requirejs/require.js -o src/js/libs/require/require.min.js -p relative -c -m --source-map
:: call npm run -s uglifyjs -- src/js/libs/require/text.js -o src/js/libs/require/text.min.js -p relative -c -m --source-map

call npm run -s json -- -f package.json dependencies['underscore'] devDependencies['backbone'] devDependencies['backbone.marionette'] devDependencies['backbone-react-component'] devDependencies['jquery'] devDependencies['jquery-mobile'] devDependencies['pouchdb'] devDependencies['react'] devDependencies['react-dom'] -a -j > script/js/main.config.version.js
:: call npm run -s replace -- ">.+" "" script/js/main.config.version.js
call npm run -s replace -- "\n| |dependencies\.|devDependencies\." "" script/js/main.config.version.js
call npm run -s replace -- ":(\D)\D" ":$1" script/js/main.config.version.js
call npm run -s replace -- "\]" ";" script/js/main.config.version.js
call npm run -s replace -- "\[" "export default" script/js/main.config.version.js
:: call npm run -s uglifyjs -- script/js/main.config.version.js -o script/js/main.config.version.js -p relative -c -m --source-map

set arg=npm run -s replace -- ",\n    \""react\"":[^\n,]*(\n)" "$1" node_modules/backbone-react-component/package.json && call run arg
set arg=npm run -s replace -- "(\{\n)    \""fbjs\"":[^\n]*\n" "$1" node_modules/subschema/package.json && call run arg
set arg=npm run -s replace -- "(\{\n)    \""lodash\"":[^\n]*\n" "$1" node_modules/subschema/package.json && call run arg