define(["apps/AppManager"], function (AppManager) {
	var Entities = AppManager.module("Entities");
	Entities.Todo = Backbone.Model.extend({
		urlRoot: "todo"
		, noIoBind: false
		, socket: window.socket
		, initialize: function () {
			// Only bind new models from the server because the server assigns the id.
			if (!this.noIoBind) {
				this.ioBind("update", this.serverChange, this);
				this.ioBind("delete", this.serverDelete, this);
			}
		}
		, serverChange: function (data) {
			// Used to prevent loops when dealing with client-side updates (e.g. forms).
			data.fromServer = true;
			this.set(data);
		}
		, serverDelete: function (data) {
			if (this.collection) {
				this.collection.remove(this);
			} else {
				this.trigger("remove", this);
			}
			this.modelCleanup();
		}
		, modelCleanup: function () {
			this.ioUnbindAll();
			return this;
		}
	});

	Entities.Todos = Backbone.Collection.extend({
		model: Entities.Todo
		, url: "todos"
		, socket: window.socket
		, initialize: function () {
			this.ioBind("create", this.serverCreate, this);
		}
		, serverCreate: function (data) {
			var oldData = this.get(data.id);
			// Check for duplicates in the collection.
			if (!oldData) {
				this.add(data);
			} else {
				data.fromServer = true;
				oldData.set(data);
			}
		}
		, collectionCleanup: function (callback) {
			this.ioUnbindAll();
			this.each(function (model) {
				model.modelCleanup();
			});

			return this;
		}
	});

	var API = {
		getTodoEntities: function () {
			var todos = new Entities.Todos();
			var defer = $.Deferred();
			todos.fetch({
				success: function (data) {
					defer.resolve(data);
				}
			});
			var promise = defer.promise();

			return promise;
		}
	};

	AppManager.reqres.setHandler("todo:entities", function () {
		return API.getTodoEntities();
	});
});