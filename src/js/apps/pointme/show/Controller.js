/*
PointMe Controller
*/
define(
["apps/common/Controller"
, "apps/common/View"
, "apps/pointme/show/View"]
, function (CommonController, CommonView, ShowView) {
	"use strict";
	return CommonController.extend({ title: "PointMe List", layout: CommonView.Layout, main: ShowView.Content });
});