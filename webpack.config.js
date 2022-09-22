const webpack = require( "webpack" )
	, { Config, environment } = require( "webpack-config" )
	, HtmlWebpackPlugin = require( "html-webpack-plugin" )
	, _env = process.env.WEBPACK_ENV || process.env.NODE_ENV || "development"
	, path = require( "path" );

environment.setAll( {
	// HACK: webpack-config@6.1.x replaces [name] with process.env.name value. Revert to "[name]" again
	name: () => "[name]" // eslint-disable-line lodash/prefer-constant
} );

module.exports = new Config().extend( `webpack.config.${_env}.js` ).merge( {
	env: {
		isDev: _env === "development"
		, isMobile: process.env.MOBILE
	}
	, plugins: [
		new webpack.optimize.CommonsChunkPlugin( {
			name: "vendor"
			, minChunks: ( module/*, count*/ ) => module.resource && module.resource.indexOf( path.resolve( "node_modules" ) ) === 0 // eslint-disable-line lodash/prefer-startswith
		} )
		, new HtmlWebpackPlugin( {
			title: "Nubrid"
			, template: "script/index.ejs"
			, inject: false
			, hash: true
			, xhtml: true
		} )
	]
} );