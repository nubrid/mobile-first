/*
Form App
*/
define(
["apps/AppManager"
, "apps/common/App"]
, function (AppManager, CommonApp) {
	"use strict";
	return AppManager.getModule("Form", CommonApp);
});