define(["apps/AppManager"], function (AppManager) {
	var Common = AppManager.module("Entities.Common");
	Common.Model = Backbone.Model.extend({
		noIoBind: false
		, initialize: function () {
			var self = this;
			if (!this.socket) this.socket = AppManager.connect(function () {
				// Only bind new models from the server because the server assigns the id.
				if (!this.noIoBind) {
					_.bindAll(self, "serverChange", "serverDelete", "modelCleanup");
					self.ioBind("update", self.serverChange, self);
					self.ioBind("delete", self.serverDelete, self);
				}
			});
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

	Common.Collection = Backbone.Collection.extend({
		noIoBind: false
		, initialize: function () {
			this.on("before:fetch", function () {
				var self = this;
				if (!this.socket) this.socket = AppManager.connect(function () {
					if (!this.noIoBind) {
						_.bindAll(self, "serverCreate", "collectionCleanup");
						self.ioBind("create", self.serverCreate, self);
					}

					self.model = self.model.extend({ socket: self.socket });
				});
			});
			this.on("after:fetch", function () {
				if (this.noIoBind) this.socket.end();
			});
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

	var fetchCollection = Common.Collection.prototype.fetch;
	Common.Collection.prototype.fetch = function () {
		if (!arguments || arguments.length == 0) arguments = [{}];
		var success = arguments[0].success;
		var error = arguments[0].error;
		var self = this;

		arguments[0].success = function (data) {
			self.trigger("after:fetch");

			if (success) success(data);
		};

		arguments[0].error = function (data) {
			self.trigger("after:fetch");

			if (error) error(data);
		};

		this.trigger("before:fetch");
		return fetchCollection.apply(this, arguments);
	};

	Common.API = {
		getModel: function (model, attributes) {
			var _model = new model(attributes);
			var defer = $.Deferred();
			_model.fetch({
				success: function (data) {
					defer.resolve(data);
				}
			});
			var promise = defer.promise();

			return promise;
		}
		, getCollection: function (collection) {
			var _collection = new collection();
			var defer = $.Deferred();
			_collection.fetch({
				success: function (data) {
					defer.resolve(data);
				}
			});
			var promise = defer.promise();

			return promise;
		}
	};
});