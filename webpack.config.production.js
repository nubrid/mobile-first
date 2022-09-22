const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" );

module.exports = new Config().extend( "webpack.config.base.js" ).merge( {
	output: {
		publicPath: "/"
		// publicPath: "https://external.cdn.com/" // TODO: If static resources are hosted externally, e.g. CDN
	}
	, plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "production" )
			}
		} )
		, new webpack.optimize.DedupePlugin()
		, new webpack.optimize.OccurrenceOrderPlugin( true )
		, new webpack.optimize.UglifyJsPlugin( {
			mangle: true
			, output: {
				comments: false
			}
			, compress: {
				warnings: false
			}
			// , prefix: "relative"
		} )
		// , new webpack.optimize.LimitChunkCountPlugin( { maxChunks: 15 } )
		, new webpack.optimize.MinChunkSizePlugin( { minChunkSize: 10000 } )
	]
} );