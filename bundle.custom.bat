git clone git://github.com/jquery/jquery.git dist/jquery
cd dist/jquery
git stash save
git stash drop
git checkout 2.2-stable
git pull
git checkout 2.2.2
call npm install
call grunt custom:-ajax,-ajax/xhr,-ajax/script,-ajax/jsonp,-css/showHide,-effects,-event/focusin,-core/ready
cd ..\..
git clone git://github.com/jquery/jquery-mobile.git dist/jquery.mobile
cd dist/jquery.mobile
git stash
git checkout 1.4-stable
git pull
git checkout 1.4.5
git stash apply
call npm install
call grunt js
call grunt css
cd ..\..

call npm run -s download -- --out dist/jquery.mobile/dist/ http://jquerymobile.com/resources/download/jquery.mobile.images-1.4.5.zip
call npm run -s 7z -- x dist/jquery.mobile/dist/jquery.mobile.images-1.4.5.zip -odist/jquery.mobile/dist/ -y

call npm run -s sprity -- create dist/jquery.mobile/dist/img dist/jquery.mobile/dist/images/icons-png/**/* -e gm --style-indent-size 0 --orientation horizontal -c ../img -n jquery.mobile.icons -s ../css/jquery.mobile.icons.png.css
set arg=npm run -s replace -- "^\n\.icon \{" ".ui-nosvg [class*=""ui-icon-""]::after,.ui-nosvg [class*=""ui-checkbox-on""]::after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.png.css && call run arg
set arg=npm run -s replace -- "\.icon-([^\{]+)-black \{" ".ui-nosvg .ui-alt-icon.ui-icon-$1:after,.ui-nosvg .ui-alt-icon .ui-icon-$1:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.png.css && call run arg
set arg=npm run -s replace -- "\.icon-([^\{]+)-white \{" ".ui-nosvg .ui-icon-$1:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.png.css && call run arg
set arg=npm run -s replace -- "\.ui-nosvg \.ui-icon-check\:after \{" ".ui-nosvg .ui-icon-check:after,html.ui-nosvg .ui-btn.ui-checkbox-on:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.png.css && call run arg
set arg=npm run -s replace -- "\.ui-nosvg \.ui-alt-icon\.ui-icon-check\:after,\.ui-nosvg \.ui-alt-icon \.ui-icon-check\:after \{" ".ui-nosvg .ui-alt-icon.ui-icon-check:after,.ui-nosvg .ui-alt-icon .ui-icon-check:after,.ui-nosvg .ui-alt-icon.ui-btn.ui-checkbox-on:after,.ui-nosvg .ui-alt-icon .ui-btn.ui-checkbox-on:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.png.css && call run arg

call npm run -s svg-sprite -- --cl horizontal -p 4,4,4,4 -b padding --css-dimensions "" --css-common svg --ccss -cD dist/jquery.mobile/dist/css --cs ../img/jquery.mobile.icons.svg --css-dest "" --css-render-css-dest jquery.mobile.icons.svg.css --css-bust false dist/jquery.mobile/dist/images/icons-svg/**/*
set arg=npm run -s replace -- "^\.svg \{" "[class*=""ui-icon-""]::after,[class*=""ui-checkbox-on""]::after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.svg.css && call run arg
set arg=npm run -s replace -- "\.svg-([^\{]+)-black \{" ".ui-alt-icon.ui-icon-$1:after,.ui-alt-icon .ui-icon-$1:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.svg.css && call run arg
set arg=npm run -s replace -- "\.svg-([^\{]+)-white \{" ".ui-icon-$1:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.svg.css && call run arg
set arg=npm run -s replace -- "\.ui-icon-check\:after \{" ".ui-icon-check:after,html .ui-btn.ui-checkbox-on.ui-checkbox-on:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.svg.css && call run arg
set arg=npm run -s replace -- "\.ui-alt-icon\.ui-icon-check\:after,\.ui-alt-icon \.ui-icon-check\:after \{" ".ui-alt-icon.ui-icon-check:after,.ui-alt-icon .ui-icon-check:after,html .ui-alt-icon.ui-btn.ui-checkbox-on:after,html .ui-alt-icon .ui-btn.ui-checkbox-on:after {" dist/jquery.mobile/dist/css/jquery.mobile.icons.svg.css && call run arg

call npm run -s uglifyjs -- dist/jquery.mobile/dist/jquery.mobile.js -o dist/jquery.mobile/dist/jquery.mobile.min.js -p relative -c -m --source-map dist/jquery.mobile/dist/jquery.mobile.min.map