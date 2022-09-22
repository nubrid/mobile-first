const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, RewirePlugin = require( "rewire-webpack" );

let _config = new Config().extend( "webpack.config.base.js" ).merge( {
	debug: true
	, devtool: "eval"
	, output: {
		pathinfo: true
	}
	, plugins: [
		new webpack.DefinePlugin( {
			__DEV__: JSON.stringify( true )
		} )
		, new RewirePlugin()
	]
	, csp: {
		directives: {
			scriptSrc: [ "'unsafe-eval'" ]
		}
	}
});
_config.entry = {};

module.exports = _config;