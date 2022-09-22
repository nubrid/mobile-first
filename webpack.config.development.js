const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, root = __dirname.replace( /\\/g, "/" )
	, WriteFileWebpackPlugin = require( "write-file-webpack-plugin" ); // For Chrome Debugger

module.exports = new Config().extend( "webpack.config.base.js" ).merge( {
	debug: true
	, devtool: "source-map" // HACK: If not using Chrome Debugger - , devtool: "eval"
	, devServer: { // For Chrome Debugger
		outputPath: "src" // For Chrome Debugger. Must be same as { output: { path } }
	}
	, output: {
		devtoolModuleFilenameTemplate( info ) { // HACK: For Chrome Debugger. Remove trailing ./ if absolute path
			if ( info.resourcePath.startsWith( root, 2 ) ) return info.resourcePath.substring( 2 );// eslint-disable-line lodash/prefer-lodash-method
			else return info.absoluteResourcePath;
		}
		, pathinfo: true
	}
	, plugins: [
		new webpack.DefinePlugin( {
			__DEV__: JSON.stringify( true )
		} )
		, new WriteFileWebpackPlugin( { // For Chrome Debugger
			log: false
			, test: /\.map$/
		} )
	]
	, csp: {
		directives: {
			scriptSrc: [ "'unsafe-eval'" ]
		}
	}
} );