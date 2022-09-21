define(
["apps/AppManager"
, "entities/Common"]
, function (AppManager) {
	"use strict";
	var Entities = AppManager.module("Entities");
	var _actionType = AppManager.TodosApp.Constants.ActionType;
	var _dispatcher = AppManager.TodosApp.dispatcher;
	Entities.Todo = Entities.Common.Model.extend({
		urlRoot: "todo"
		, noIoBind: false
	});

	Entities.Todos = Entities.Common.Collection.extend({
		model: Entities.Todo
		, url: "todos"
		, noIoBind: false
		, initialize: function () {
			this.listenTo(_dispatcher, "dispatch", $.proxy(function (payload) {
				switch (payload.actionType) {
					case _actionType.CREATE:
						this.create(payload.attrs, { wait: true });

						break;
					case _actionType.UPDATE:
						this.get(payload.attrs.id).save(payload.attrs);

						break;
					case _actionType.DELETE:
						this.get(payload.attrs.id).destroy();

						break;
				}
			}, this));

			return Entities.Common.Collection.prototype.initialize.apply(this, arguments);
		}
		, close: function () {
			this.stopListening(_dispatcher);
			if (this.socket) this.socket.end();
		}
	});

	AppManager.reqres.setHandler("todo:entities", function () {
		return Entities.Common.API.getCollection(AppManager.Entities.Todos);
	});
});