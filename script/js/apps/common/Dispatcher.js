import AppManager from "apps/AppManager";
let Common = {};

Common.Dispatcher = Marionette.Object.extend({
	initialize () {
		this.on("all", this.dispatch);
	}
	, dispatch( eventName, payload ) {
		if (eventName !== "dispatch") this.trigger("dispatch", payload);
	}
});

AppManager.reqres.setHandler("dispatcher", name => {
	Common.dispatcher = Common.dispatcher || {};
	Common.dispatcher[name] = Common.dispatcher[name] || new Common.Dispatcher();
	return Common.dispatcher[name];
});

export default Common.Dispatcher;