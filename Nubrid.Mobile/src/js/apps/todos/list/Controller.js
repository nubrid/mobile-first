/*
Todos List Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/todos/list/View"
, "apps/common/Dispatcher"]
, function (AppManager, CommonView, ListView) {
	"use strict";
	var Controller = AppManager.module("TodosApp.List.Controller", AppManager.Common.Module.extend({
		listTodos: function () {
			var page = AppManager.changePage({ id: "todos", title: "Todos List", layout: CommonView.Layout, main: ListView.Todos });
			page.on("all", function (actionType, attrs) {
				this.dispatcher.trigger(actionType, { actionType: actionType, attrs: attrs });
			});
		}
		, onStart: function () {
			AppManager.on("todos:list", this.listTodos);
		}
	}));

	return Controller;
});