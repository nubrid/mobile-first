define(["apps/AppManager"], function (AppManager) {
	var TodosApp = AppManager.module("TodosApp");
	TodosApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"todos": "listTodos"
		}
	});

	var API = {
		listTodos: function () {
			require(["apps/todos/list/ListController"], function () {
				TodosApp.List.Controller.listTodos();
			});
		}
	};

	AppManager.on("todos:list", function () {
		AppManager.navigate("todos");
		API.listTodos();
	});

	AppManager.addInitializer(function () {
		new TodosApp.Router({
			controller: API
		});
	});

	return AppManager;
});