// The Todo model will bind to the server's 'update' and 'delete' events.
// The noIoBind is set to false so that models that are created via the collection are bound.
define([], function () {
	App.Models.Todo = Backbone.Model.extend({
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

	return App.Models.Todo;
});