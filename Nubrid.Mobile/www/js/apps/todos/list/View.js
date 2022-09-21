/*
Todo List View
*/
define(
["apps/AppManager"
, "apps/todos/common/View"]
, function (AppManager) {
	var List = AppManager.module("TodosApp.List");
	List.Layout = AppManager.TodosApp.Common.View.Layout.extend({});

	List.Form = AppManager.TodosApp.Common.View.Form.extend({
		title: "New Todo"
		, onRender: function () {
		}
	});

	List.Todos = AppManager.TodosApp.Common.View.Todos.extend({});

	return List.Layout;
});