window.url = !!__URL__ ? __URL__ : `${document.location.protocol}//${document.location.host}`;

if ( __MOBILE__ ) {
	require( "jquery/src/core/init" );
	require( "jquery/src/selector" );
	require( "jquery/src/traversing" );
	require( "jquery/src/callbacks" );
	require( "jquery/src/deferred" );
	require( "jquery/src/deferred/exceptionHook" );
	require( "jquery/src/data" );
	require( "jquery/src/queue" );
	require( "jquery/src/queue/delay" );
	require( "jquery/src/attributes" );
	require( "jquery/src/event" );
	require( "jquery/src/event/alias" );
	require( "jquery/src/manipulation" );
	require( "jquery/src/wrap" );
	require( "jquery/src/css" );
	require( "jquery/src/css/hiddenVisibleSelectors" );
	require( "jquery/src/serialize" );
	require( "jquery/src/ajax/load" );
	require( "jquery/src/effects/animatedSelector" );
	require( "jquery/src/offset" );
	require( "jquery/src/dimensions" );
	require( "jquery/src/deprecated" );
	require( "jquery/src/exports/amd" );

	window.jQuery = jQuery; // HACK: Needed for custom jQuery build
}

function _start(react, reactDOM) {
	if (react) window.React = react;
	if (reactDOM) window.ReactDOM = reactDOM;

	require( "main.init" );
	if ( __MOBILE__ ) require.ensure( [], require => { require( "imports?this=>window!jquery.mobile" ); require( "apps" ).start(); }, "jquery.mobile" );
	else requirejs( [ "jquery.mobile" ], () => require( "apps" ).start() );
}

if ( __MOBILE__ ) _start();
else requirejs( [ "main.config" ], () => requirejs( [ "react", "react.dom", "vendor" ], _start ));