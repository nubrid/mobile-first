export default class Dispatcher {
	_dispatcher = { ...Backbone.Events };

	constructor() {
		this._dispatcher.on( "all", this.dispatch );

		return this._dispatcher;
	}

	dispatch( eventName, payload ) {
		if ( eventName !== "dispatch" ) this.trigger( "dispatch", { ...payload, actionType: eventName } );
	}
}