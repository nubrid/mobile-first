/*
Form Show Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/form/show/View"]
, function (AppManager, CommonView, ShowView) {
	"use strict";
	//return {
	//	start: function (name) {
	//		var controller = AppManager.module(name + ".Controller", function () {
	//			this.show = function () {
	//				var page = AppManager.changePage({ id: "form", title: "Form", layout: CommonView.Layout, main: ShowView.Form });
	//				page.on("all", function (actionType, attrs) {
	//					this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
	//				});
	//			};

	//			// TODO: this.on("form:show", this.show);
	//		});

	//		controller.show();

	//		return controller;
	//	}
	//};
	//var Controller = AppManager.module("FormApp.List.Controller", AppManager.module("Common.Module").extend({
	return Marionette.Module.extend({
		show: function () {
			var page = AppManager.changePage({ id: "form", title: "Form List", layout: CommonView.Layout, main: ListView.Form });
			page.on("all", function (actionType, attrs) {
				this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
			});
		}
		, onStart: function () {
			AppManager.on("form:show", this.show);
			AppManager.trigger("form:show");
		}
	});
	//}));

	//return Controller;
});