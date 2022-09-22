/*
Common Dispatcher
*/
const _common = {};

_common.Dispatcher = Marionette.Object.extend( {
	initialize() {
		this.on( "all", this.dispatch );
	}
	, dispatch( eventName, payload ) {
		if ( eventName !== "dispatch" ) this.trigger( "dispatch", payload );
	}
} );

AppManager.reqres.setHandler( "dispatcher", name => {
	_common.dispatcher = _common.dispatcher || {};
	_common.dispatcher[ name ] = _common.dispatcher[ name ] || new _common.Dispatcher();
	return _common.dispatcher[ name ];
});

export default _common.Dispatcher;