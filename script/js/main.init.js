$( document ).on( "mobileinit", function() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;

	// Use Backbone routing
	$.mobile.autoInitializePage = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;

	$.mobile.keepNative = "a,button,input";
} );

// HACK: $ 3.0 fix for $ Mobile 1.4.5
$.event.props = ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
	"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " );
$.event.fixHooks = {};
$.event.keyHooks = {
	props: "char charCode key keyCode".split( " " ),
	filter: function( event, original ) {

		// Add which for key events
		if ( event.which === null ) {
			event.which = original.charCode !== null ? original.charCode : original.keyCode;
		}

		return event;
	}
};
$.event.mouseHooks = {
	props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
		"screenX screenY toElement" ).split( " " ),
	/* jshint maxcomplexity: false */
	filter: function( event, original ) {
		var eventDoc, doc, body,
			button = original.button;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX === null && original.clientX !== null ) {
			eventDoc = event.target.ownerDocument || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;

			event.pageX = original.clientX +
				( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
				( doc && doc.clientLeft || body && body.clientLeft || 0 );
			event.pageY = original.clientY +
				( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
				( doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && button !== undefined ) {
			event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) ); // jshint ignore:line
		}

		return event;
	}
};
$.each( ( "load" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	$.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );