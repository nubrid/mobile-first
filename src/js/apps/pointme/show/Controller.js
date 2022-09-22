/*
PointMe Controller
*/
define(
["apps/common/Controller"
, "apps/pointme/show/View"]
, function (CommonController, ShowView) {
	"use strict";
	return CommonController.extend({ title: "PointMe List", Main: ShowView.Content });
});