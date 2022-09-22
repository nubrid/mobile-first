const webpack = require( "webpack" )
	, { Config, environment } = require( "webpack-config" )
	, HtmlWebpackPlugin = require( "html-webpack-plugin" )
	, _env = process.env.WEBPACK_ENV || process.env.NODE_ENV || "development";

environment.setAll( {
	name: () => "[name]" // HACK: webpack-config@6.1.x replaces [name] with process.env.name value. Revert to "[name]" again.
} );

module.exports = new Config().extend( `webpack.config.${_env}.js` ).merge( {
	env: {
		isDev: _env === "development"
		, isMobile: process.env.MOBILE
	}
	, plugins: [
		new webpack.optimize.CommonsChunkPlugin( { names: [ "vendor" ] })
		, new HtmlWebpackPlugin( {
			title: "Nubrid"
			, template: "script/index.ejs"
			, inject: false
			, hash: true
			, xhtml: true
		} )
	]
} );