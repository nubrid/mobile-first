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
REM call bundle.custom.bat
REM copy /Y .\node_modules\pouchdb\dist\pouchdb.js .\src\js\libs\pouchdb\pouchdb.js
REM copy /Y .\node_modules\pouchdb\dist\pouchdb.min.js .\src\js\libs\pouchdb\pouchdb.min.js
REM copy /Y .\node_modules\socket-pouch\dist\socket-pouch.client.js .\src\js\libs\pouchdb\pouchdb.socket.js
REM set arg=npm run -s replace -- "(api\._socket = new )Socket\(" "$1opts.Socket(" src/js/libs/pouchdb/pouchdb.socket.js && call run arg
:: copy /Y .\node_modules\socket-pouch\dist\socket-pouch.client.min.js .\src\js\libs\pouchdb\pouchdb.socket.min.js

call log :i "build libs: download cdn"
call npm run -s download -- --out src/js/libs/ http://www.nubrid.com/primus/primus.io.js

call log :i "build libs: minify"
REM call npm run -s uglifyjs -- src/js/libs/pouchdb/pouchdb.socket.js -o src/js/libs/pouchdb/pouchdb.socket.min.js -p relative -c -m --source-map
call npm run -s uglifyjs -- src/js/libs/primus.io.js -o src/js/libs/primus.io.min.js -p relative -c -m --source-map

REM call npm run -s json -- -f package.json dependencies['underscore'] devDependencies['backbone'] devDependencies['backbone.marionette'] devDependencies['backbone-react-component'] devDependencies['jquery'] devDependencies['jquery-mobile'] devDependencies['pouchdb'] devDependencies['react'] devDependencies['react-dom'] -a -j > script/js/main.config.version.js
REM call npm run -s replace -- "\n| |dependencies\.|devDependencies\." "" script/js/main.config.version.js
REM call npm run -s replace -- ":(\D)\D" ":$1" script/js/main.config.version.js
REM call npm run -s replace -- "\]" ";" script/js/main.config.version.js
REM call npm run -s replace -- "\[" "export default" script/js/main.config.version.js
