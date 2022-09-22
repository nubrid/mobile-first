import Apps from "apps";

ReactDOM.render(
	<Apps />,
	document.getElementById( "main" ),
);

// TODO: require( "main.init" );
// require.ensure( [], require => require( "imports?this=>window!jquery.mobile" ), "jquery.mobile" );
// require( "apps" ).start();