/*
Form Show Controller
*/
define(
["apps/common/Controller"
, "apps/common/View"
, "apps/form/show/View"]
, function (CommonController, CommonView, ShowView) {
	"use strict";
	return _.extend(CommonController, { id: "form", title: "Form List", layout: CommonView.Layout, main: ShowView.Form });
});