﻿/*
Todos App
*/
define(
["apps/AppManager"
, "apps/common/Dispatcher"]
, function (AppManager, Dispatcher) {
	"use strict";
	var TodosApp = AppManager.module("TodosApp", AppManager.Common.Module.extend({
		Router: Marionette.AppRouter.extend({
			appRoutes: {
				"todos": "listTodos"
			}
		})
		, onStart: function () {
			require(["apps/todos/list/Controller"], function (controller) { // TODO: , require(["apps/todos/list/Controller", "apps/todos/new/Controller"], function (listController, newController) {
				// TODO: var controller = _.extend(listController, newController);
				/* jshint nonew: false */
				new TodosApp.Router({
					controller: controller
				});

				controller.start(); // TODO: listController.start();
				// TODO: newController.start();

				AppManager.trigger(AppManager.currentRoute() + ":list");
			});
		}
		, dispatcher: new Dispatcher()
		, Constants: {
			ActionType: {
				CREATE: "todo:create"
				, UPDATE: "todo:update"
				, DELETE: "todo:delete"
			}
		}
	}));

	return TodosApp;
});