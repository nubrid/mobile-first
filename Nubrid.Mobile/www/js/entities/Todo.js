define(
["apps/AppManager"
, "entities/Common"]
, function (AppManager) {
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
			var self = this;
			this.listenTo(_dispatcher, "dispatch", function (payload) {
				switch (payload.actionType) {
					case _actionType.CREATE:
						self.create(payload.attrs, { wait: true });

						break;
					case _actionType.UPDATE:
						self.get(payload.attrs.id).save(payload.attrs);

						break;
					case _actionType.DELETE:
						self.get(payload.attrs.id).destroy();

						break;
				}
			});

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