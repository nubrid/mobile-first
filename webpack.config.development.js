const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" );

module.exports = new Config().extend( "webpack.config.base.js" ).merge( {
	debug: true
	, devtool: "eval"
	, output: {
		pathinfo: true
	}
	, plugins: [
		new webpack.DefinePlugin( {
			__DEV__: JSON.stringify( true )
		} )
	]
	, csp: {
		directives: {
			scriptSrc: [ "'unsafe-eval'" ]
		}
	}
} );