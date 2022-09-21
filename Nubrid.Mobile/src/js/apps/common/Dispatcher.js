/*
// TODO:
*/
define(
["apps/AppManager"]
, function (AppManager) {
	"use strict";
	var Common = AppManager.module("Common");
	//var _callbacks = [];
	//var _promises = [];
	Common.Dispatcher = Marionette.Object.extend({
		initialize: function () {
			this.on("all", this.dispatch);
		}
		, dispatch: function (eventName, payload) {
			if (eventName !== "dispatch") this.trigger("dispatch", payload);
			//var resolves = [];
			//var rejects = [];
			//_promises = _.map(_callbacks, function (value, i) {
			//	var deferred = $.Deferred();
			//	resolves[i] = deferred.resolve;
			//	rejects[i] = deferred.reject;

			//	return deferred.promise();
			//});

			//_.each(_callbacks, function (callback, i) {
			//	$.when(callback(payload))
			//		.done(function () {
			//			resolves[i](payload);
			//		})
			//		.fail(function () {
			//			rejects[i](new Error("Dispatcher callback unsuccessful."));
			//		});
			//});

			//_promises = [];
		}
		//, register: function (callback) {
		//	if (!_.isFunction(callback)) throw new Error("Dispatcher only registers callback functions.");

		//	_callbacks.push(callback);

		//	return _callbacks.length - 1;
		//}
	});

	AppManager.reqres.setHandler("dispatcher", function (name) {
		Common.dispatcher = Common.dispatcher || {};
		return Common.dispatcher[name] = Common.dispatcher[name] || new Common.Dispatcher();
	});

	return Common.Dispatcher;
});