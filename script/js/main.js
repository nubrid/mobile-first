window.url = !!__URL__ ? __URL__ : `${document.location.protocol}//${document.location.host}`;

require( "main.init" );
require.ensure( [], require => require( "imports?this=>window!jquery.mobile" ), "jquery.mobile" );
require( "apps" ).start();