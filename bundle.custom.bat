REM git clone git://github.com/jquery/jquery.git dist/jquery
REM cd dist/jquery
REM git stash save
REM git stash drop
REM REM git checkout 3.0-stable
REM git fetch --tags
REM git checkout 3.0.0
REM call npm install
REM call grunt custom:-ajax,-ajax/xhr,-ajax/script,-ajax/jsonp,-css/showHide,-effects,-event/focusin,-core/ready
REM cd ..\..
git clone git://github.com/jquery/jquery-mobile.git dist/jquery.mobile
cd dist/jquery.mobile
git stash save
git stash drop
REM git checkout 1.4-stable
git fetch --tags
git checkout 1.4.5
REM git stash apply
call npm install
cd ..\..
set arg=npm run -s replace -- "\t\""require\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/loader\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/events\/navigate\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/navigation\/path\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/navigation\/history\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/navigation\/navigator\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/navigation\/method\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/transitions\/handlers\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/transitions\/visuals\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.animationComplete\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.navigation\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.degradeInputs\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/page\.dialog\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/dialog\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/collapsible\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/collapsibleSet\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.fieldContain\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.grid\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/navbar\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/listview\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/listview\.autodividers\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.nojs\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/listview\.hidedividers\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/checkboxradio\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/button\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/slider\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/slider\.tooltip\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/flipswitch\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/rangeslider\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/textinput\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/clearButton\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/autogrow\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/select\.custom\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/forms\/select\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.buttonMarkup\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/controlgroup\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.links\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/toolbar\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/fixedToolbar\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/fixedToolbar\.workarounds\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/popup\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/popup\.arrow\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
REM set arg=npm run -s replace -- "\t\""\.\/widgets\/panel\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/table\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/table\.columntoggle\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/table\.reflow\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/filterable\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/filterable\.backcompat\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/widgets\/tabs\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.zoom\"",\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
set arg=npm run -s replace -- "\t\""\.\/jquery\.mobile\.zoom\.iosorientationfix\""\r\n" "" dist/jquery.mobile/js/jquery.mobile.js && call run arg
cd dist/jquery.mobile
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