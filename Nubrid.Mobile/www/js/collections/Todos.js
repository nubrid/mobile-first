// The Todos collection responds to 'create' events from the server.
// When a new Todo is created, it's broadcasted using socket.io upon creation.
define(["models/Todo"], function (Todo) {
	App.Collections.Todos = Backbone.Collection.extend({
		model: Todo
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

	return App.Collections.Todos;
});