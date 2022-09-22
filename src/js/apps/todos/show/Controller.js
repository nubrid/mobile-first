/*
Todos Show Controller
*/
define(
["apps/common/Controller"
, "apps/common/View"
, "apps/todos/show/View"]
, function (CommonController, CommonView, ShowView) {
	"use strict";
	return _.extend(CommonController, { id: "todos", title: "Todos List", layout: CommonView.Layout, main: ShowView.Content });
});