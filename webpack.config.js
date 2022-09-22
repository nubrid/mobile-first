let { Config } = require( "webpack-config" )
	, _env = process.env.WEBPACK_ENV || process.env.NODE_ENV || "development";

module.exports = new Config().extend( `webpack.config.${_env}.js` ).merge( {
	env: {
		isDEV: _env === "development"
		, isMobile: process.env.MOBILE
	}
} );