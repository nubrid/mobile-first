define(
["apps/AppManager"
, "backbone.immutable"
, "backbone.iobind"]
, function (AppManager, BackboneImmutable) {
	"use strict";

	var Common = {};

	BackboneImmutable.infect(Backbone);
	Common.PureRenderMixin = BackboneImmutable.PureRenderMixin;

	// HACK: Force websocket if available.
	if (Modernizr.websockets) {
		var _merge = Primus.prototype.merge;
		Primus.prototype.merge = function () {
			var target = _merge.apply(this, arguments);

			return _.extend(target, {
				transports: [
					"websocket"
				]
			});
		};
	}

	// HACK: For compatibility of primus with backbone.iobind.
	var _emit = Primus.prototype.emit;
	var _sendMethods = [
	"*:create"
	, "*:delete"
	, "*:read"
	, "*:update"
	];
	Primus.prototype.emit = function () {
		var message = arguments[0];
		var delimiterIndex = message.lastIndexOf(":");
		var method = "*" + message.substring(delimiterIndex);
		if (arguments.length === 3 && _.indexOf(_sendMethods, method) !== -1) {
			var args = _.extend([], arguments);
			args.splice(0, 1, method);
			args.splice(2, 0, message.substring(0, delimiterIndex));
			Primus.prototype.send.apply(this, args);
		}
		else {
			_emit.apply(this, arguments);
		}
	};

	function _connect (options) {
		if (_.isFunction(options)) {
			options = { callback: options };
		}

		var primus = options.socket || new Primus(window.url
			, options.closeOnOpen
			? { manual: true, strategy: false }
			: { manual: true });

		function primus_onOpen() {
			if (options.callback) options.callback();
			if (options.closeOnOpen) {
				primus.end();
			}
		}

		if (primus.readyState === Primus.OPEN) {
			primus_onOpen();

			return primus;
		}

		if (primus.readyState !== Primus.OPENING) primus.open();
		primus.on("open", function () {
			console.log("connection established");
			primus_onOpen();
		});

		primus.on("error", function (error) {
			console.log(error);
		});

		return primus;
	}

	Common.ActionType = function (name) {
		name = name || "";

		return {
			CREATE: name + ":create"
			, UPDATE: name + ":update"
			, DELETE: name + ":delete"
		};
	};

	Common.Model = Backbone.Model.extend({
		urlRoot: "*"
		, noIoBind: false
		, initialize: function () {
			this.socket = _connect({
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
		url: "*"
		, noIoBind: false
		, model: Common.Model
		, initialize: function () {
			this.actionType = Common.ActionType(this.url);

			this.listenTo(this.dispatcher, "dispatch", $.proxy(function (payload) {
				switch (payload.actionType) {
					case this.actionType.CREATE:
						this.create(_.omit(payload.attrs, "id"), { wait: true });

						break;
					case this.actionType.UPDATE:
						this.get(payload.attrs.id).save(payload.attrs);

						break;
					case this.actionType.DELETE:
						this.get(payload.attrs.id).destroy();

						break;
				}
			}, this));

			this.on("before:fetch", function () {
				this.socket = _connect({
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
		, close: function () {
			this.stopListening(this.dispatcher);
			if (this.socket) this.socket.end();
		}
	});

	Common.API = {
		getModel: function (Model, attributes) {
			var model = new Model(attributes);
			var defer = $.Deferred();
			model.socket = _connect({
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
		, getEntity: function (Collection, options) {
			var collection = new Collection(null, options);
			var defer = $.Deferred();
			collection.socket = _connect({
				socket: collection.socket
				, callback: function () {
					collection.fetch({
						success: function (data) {
							defer.resolve(data);
						}, data: {
							query: options.query
						}
					});
				}
			});
			var promise = defer.promise();

			return {
				fetch: promise
				, actionType: collection.actionType
			};
		}
	};

	AppManager.reqres.setHandler("entity", function (options) {
		return Common.API.getEntity(
			Common.Collection.extend({
				model: Common.Model.extend({
					urlRoot: options.url
				})
				, url: options.url
				, dispatcher: options.dispatcher
			})
			, options);
	});

	return Common;
});