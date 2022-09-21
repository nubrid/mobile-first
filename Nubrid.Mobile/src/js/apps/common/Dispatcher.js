define(["apps/AppManager"], function (AppManager) {
	"use strict";
	var Common = AppManager.module("Common");

	Common.Dispatcher = Marionette.Object.extend({
		initialize: function () {
			this.on("all", this.dispatch);
		}
		, dispatch: function (eventName, payload) {
			if (eventName !== "dispatch") this.trigger("dispatch", payload);
		}
	});

	AppManager.reqres.setHandler("dispatcher", function (name) {
		Common.dispatcher = Common.dispatcher || {};
		Common.dispatcher[name] = Common.dispatcher[name] || new Common.Dispatcher();
		return Common.dispatcher[name];
	});

	return Common.Dispatcher;
});