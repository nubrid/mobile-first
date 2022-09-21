/*
Todos Show Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/todos/show/View"]
, function (AppManager, CommonView, ShowView) {
	"use strict";
	//return {
	//	start: function (name) {
	//		var controller = AppManager.module(name + ".Controller", function () {
	//			this.show = function () {
	//				var page = AppManager.changePage({ id: "todos", title: "Todos List", layout: CommonView.Layout, main: ShowView.Todos });
	//				page.on("all", function (actionType, attrs) {
	//					this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
	//				});
	//			};

	//			// TODO: this.on("todos:show", this.show);
	//		});

	//		controller.show();

	//		return controller;
	//	}
	//};
	//var Controller = AppManager.module("TodosApp.Show.Controller", AppManager.module("Common.Module").extend({
	return Marionette.Module.extend({
		show: function () {
			var page = AppManager.changePage({ id: "todos", title: "Todos List", layout: CommonView.Layout, main: ShowView.Todos });
			page.on("all", function (actionType, attrs) {
				this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
			});
		}
		, onStart: function () {
			AppManager.on("todos:show", this.show);
			AppManager.trigger("todos:show");
		}
	});
	//}));

	//return Controller;
});