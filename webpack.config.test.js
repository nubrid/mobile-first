const { Config } = require( "webpack-config" )
	, RewirePlugin = require( "rewire-webpack" );

let _config = new Config().extend( "webpack.config.development.js" ).merge( {
	plugins: [
		new RewirePlugin()
	]
});
_config.entry = {};

module.exports = _config;