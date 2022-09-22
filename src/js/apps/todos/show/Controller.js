/*
Todos Show Controller
*/
define(
["apps/common/Controller"
, "apps/todos/show/View"]
, function (CommonController, ShowView) {
	"use strict";
	return CommonController.extend({ title: "Todos List", Main: ShowView.Content });
});