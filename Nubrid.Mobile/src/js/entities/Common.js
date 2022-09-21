define(["apps/AppManager"], function (AppManager) {
	"use strict";
	var Common = AppManager.module("Entities.Common");
	Common.Model = Backbone.Model.extend({
		noIoBind: false
		, initialize: function () {
			this.socket = AppManager.connect({
				socket: this.socket
				, callback: $.proxy(function () {
					// Only bind new models from the server because the server assigns the id.
					if (!this.noIoBind) {
						_.bindAll(this, "serverChange", "serverDelete", "modelCleanup");
						this.ioBind("update", this.serverChange, this);
						this.ioBind("delete", this.serverDelete, this);
					}
				}, this)
			});

			this.on("after:save", function () {
				if (this.noIoBind) this.socket.end();
			});
		}
		, destroy: function () {
			if (!this.socket) this.socket = this.collection.socket;

			return Backbone.Model.prototype.destroy.apply(this, arguments);
		}
		, save: function (attrs, options) {
			if (!this.socket) this.socket = this.collection.socket;

			options = options || {};

			// TODO: Uncomment if trimming attrs are required.
			//attrs = attrs || this.toJSON();
			//if (attrs.fromServer) return;

			//// Replace attrs with trimmed version
			//attrs = _.omit(attrs, "fromServer");

			//// Move attrs to options
			//options.attrs = attrs;

			var success = options.success;
			options.success = $.proxy(function (model, response) {
				this.trigger("after:save");

				if (success) success(model, response);
			}, this);

			var error = options.error;
			options.error = $.proxy(function (model, response) {
				this.trigger("after:save");

				if (error) error(model, response);
			}, this);

			this.trigger("before:save");
			// Call super with attrs moved to options
			Backbone.Model.prototype.save.call(this, attrs, options);
			return this;
		}
		, serverChange: function (data) {
			if (!this.socket) this.socket = this.collection.socket;

			// Used to prevent loops when dealing with client-side updates (e.g. forms).
			//this.fromServer = true;
			if (this.changedAttributes(data)) this.set(data);
		}
		, serverDelete: function () {
			if (!this.socket) this.socket = this.collection.socket;

			this.modelCleanup();

			if (this.collection) {
				this.collection.remove(this);
			} else {
				this.trigger("remove", this);
			}
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
				this.socket = AppManager.connect({
					socket: this.socket
					, callback: $.proxy(function () {
						if (!this.noIoBind) {
							_.bindAll(this, "serverCreate", "collectionCleanup");
							this.ioBind("create", this.serverCreate, this);
						}

						this.model = this.model.extend({ socket: this.socket });
					}, this)
				});
			});
			this.on("after:fetch", function () {
				if (this.noIoBind) this.socket.end();
			});
		}
		, fetch: function () {
			var args = arguments;
			if (!args || args.length === 0) args = [{}];

			var success = args[0].success;
			args[0].success = $.proxy(function (data) {
				this.trigger("after:fetch");

				if (success) success(data);
			}, this);

			var error = args[0].error;
			args[0].error = $.proxy(function (data) {
				this.trigger("after:fetch");

				if (error) error(data);
			}, this);

			this.trigger("before:fetch");
			return Backbone.Collection.prototype.fetch.apply(this, args);
		}
		, serverCreate: function (data) {
			var oldData = this.get(data.id);
			// Check for duplicates in the collection.
			if (!oldData) {
				this.add(data);
			} else {
				//oldData.fromServer = true;
				if (oldData.changedAttributes(data)) oldData.set(data);
			}
		}
		, collectionCleanup: function () {
			this.ioUnbindAll();
			this.each(function (model) {
				model.modelCleanup();
			});

			return this;
		}
	});

	Common.API = {
		getModel: function (Model, attributes) {
			var model = new Model(attributes);
			var defer = $.Deferred();
			model.socket = AppManager.connect({
				socket: model.socket
				, callback: function () {
					model.fetch({
						success: function (data) {
							defer.resolve(data);
						}
					});
				}
			});
			var promise = defer.promise();

			return promise;
		}
		, getCollection: function (Collection) {
			var collection = new Collection();
			var defer = $.Deferred();
			collection.socket = AppManager.connect({
				socket: collection.socket
				, callback: function () {
					collection.fetch({
						success: function (data) {
							defer.resolve(data);
						}
					});
				}
			});
			var promise = defer.promise();

			return promise;
		}
	};
});