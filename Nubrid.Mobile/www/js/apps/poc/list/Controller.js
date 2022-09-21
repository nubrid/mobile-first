/*
Poc List Controller
*/
define(
["apps/AppManager"
, "apps/common/View"
, "apps/poc/list/View"
, "apps/todos/App"
, "entities/Todo"]
, function (AppManager, CommonView, ListView) {
	var Controller = AppManager.module("PocApp.List.Controller", AppManager.Common.Module.extend({
		listPoc: function () {
			var fetchingPoc = AppManager.request("todo:entities");
			$.when(fetchingPoc).done(function (poc) {
				var page = AppManager.changePage({ id: "poc", title: "Poc List", layout: CommonView.Layout, main: ListView.Poc, collection: poc });

				page.on("poc:add", function (attrs) {
					// Set noIoBind to true to disable ioBind events as there is no id.
					var poc = AppManager.Entities.Todo.extend({ noIoBind: true });

					var _poc = new poc(attrs);
					AppManager.toggleLoading("show");
					_poc.socket = AppManager.connect(function () {
						_poc.save({}, {
							success: function (model, response) {
								model.socket.end();
								AppManager.toggleLoading("hide");
							}
							, error: function (model, response) {
								model.socket.end();
								AppManager.toggleLoading("hide");
							}
						});
					});
				});

				page.on("poc:edit", function (model) {
					model.save();
				});

				page.on("poc:delete", function (model) {
					model.destroy();
				});
			});
		}
		, onStart: function () {
			AppManager.on("poc:list", this.listPoc);
		}
	}));

	return Controller;
});