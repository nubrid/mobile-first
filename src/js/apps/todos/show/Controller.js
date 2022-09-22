/*
Todos Show Controller
*/
define(
["apps/common/Controller"
, "apps/common/View"
, "apps/todos/show/View"]
, function (CommonController, CommonView, ShowView) {
	"use strict";
	return CommonController.extend({ title: "Todos List", layout: CommonView.Layout, main: ShowView.Content });
});