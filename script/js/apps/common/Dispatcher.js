/*
Common Dispatcher
*/
// TODO: const _common = {};

export default class Dispatcher { // TODO: _common.Dispatcher = Marionette.Object.extend( {
	_dispatcher = { ...Backbone.Events }; // TODO: _.clone( Backbone.Events );

	constructor() { // TODO: initialize() {
		this._dispatcher.on( "all", this.dispatch );

		return this._dispatcher;
	}// TODO: ,

	dispatch( eventName, payload ) {
		if ( eventName !== "dispatch" ) this.trigger( "dispatch", { ...payload, actionType: eventName } ); // TODO: this._dispatcher.trigger( "dispatch", payload );
	}// TODO: ,
}// TODO: );

// TODO: AppManager.reqres.setHandler( "dispatcher", name => {
// 	_common.dispatcher = _common.dispatcher || {};
// 	_common.dispatcher[ name ] = _common.dispatcher[ name ] || new Dispatcher(); // TODO: _common.Dispatcher();
// 	return _common.dispatcher[ name ];
// });

// TODO: export default _common.Dispatcher;