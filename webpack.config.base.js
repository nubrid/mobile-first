const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, HtmlWebpackPlugin = require( "html-webpack-plugin" )
	, fs = require( "fs" )
	, path = require( "path" )
	, cspBuilder = require( "content-security-policy-builder" )
	, host = require( "./app.config" ).web.host
	, _getDirectories = ( sourcePath, filterRegex ) =>
		fs.readdirSync( sourcePath ).filter( file =>
			filterRegex.test( file ) && fs.statSync( path.join( sourcePath, file ) ).isDirectory()
		);

const _config = {
	entry: {
		main: "main"
		, vendor: [ // HACK: Must follow dependency sequence
			"./modernizr-config.json"
		]
	}
	, output: {
		path: "webpack" // TODO: replace with "src"
		, publicPath: "/"
		, filename: "js/[name].js"
	}
	, plugins: [
		new webpack.DefinePlugin( {
			__MOBILE__: JSON.stringify( JSON.parse( process.env.MOBILE || "false" ) )
			, __URL__: JSON.stringify( `${process.env.URL || ""}`.trim() )
		} )
		// TODO: , new webpack.optimize.CommonsChunkPlugin( { names: [ "vendor" ] } )
		, new webpack.ContextReplacementPlugin( /apps$/, new RegExp( `^\.\/(${_getDirectories( "script/js/apps", /^(?!common).*$/ ).join( "|" )})\/show\/App\.js$` ) )
		, new HtmlWebpackPlugin( {
			title: "Nubrid"
			, template: "script/index.ejs"
			, inject: false
			, hash: true
			, xhtml: true
		} )
		, new webpack.IgnorePlugin( /cordova/ )
		, new webpack.ProvidePlugin( {
			AppManager: "apps"
			, _: "underscore"
			, $: "jquery"
			, jQuery: "jquery"
			, Backbone: "backbone"
			, BackboneImmutable: "immutable-backbone"
			, BackbonePouch: "backbone-pouch"
			, BackboneReactMixin: "backbone.react"
			, Marionette: "backbone.marionette"
			, Modernizr: path.resolve( "modernizr-config.json" )
			, PouchDB: "pouchdb/lib"
			, Primus: "libs/primus.io.min"
			, React: "react"
			, ReactDOM: "react-dom"
			, ReactCSSTransitionGroup: "react-addons-css-transition-group"
			, ReactPureRenderMixin: "react-addons-pure-render-mixin"
			, ReactTransitionGroup: "react-addons-transition-group"
			, requirejs: "requirejs"
		} )
	]
	, resolve: {
		root: [ path.resolve( "script/js" ) ]
		// TODO: , extensions: [ "", ".js", ".json", ".coffee" ]
		, modulesDirectories: [ "node_modules", "dist" ]
		, alias: {
			"backbone.iosync": "backbone.iobind/lib/sync" // TODO: Remove
			, "backbone.react$": "backbone-react-component/lib/component"
			, "cordova": "../cordova" // TODO: requirejs
			, "jquery$": "jquery/src/core"
			, "jquery.mobile$": "jquery.mobile/dist/jquery.mobile"
			, "pouchdb$": "pouchdb/lib"
			, "pouchdb.socket": "socket-pouch/lib/client"
			, "requirejs$": "exports?requirejs!requirejs/require"
		}
	}
	, module: {
		loaders: [
			{ test: /\.jsx?$/, loader: "babel-loader"
				, exclude: /(libs|dist|node_modules|bower_components)/
				, query: {
					plugins: [
						"babel-plugin-add-module-exports"
						, "transform-runtime"
					]
					, cacheDirectory: true
				}
			}
			, { test: /\.coffee$/, loader: "coffee-loader" }
			, { test: /modernizr-config\.json$/, loader: "modernizr" }
			, { test: /\.(png|jpg)$/, loader: "url?limit=8192" }
			, { test: /\.css$/, loader: "style!css" }
			, { test: /\.less$/, loader: "style!css!less" } // TODO: Use LESS for CSS
		]
		, noParse: [
			/jquery\.mobile/
			, /primus\.io/
		]
	}
	, csp: {
		directives: {
			defaultSrc: [ "'self'", "gap:", "https://ssl.gstatic.com" ]
			, mediaSrc: "*"
			, imgSrc: [ "'self'", "data:" ]
			, scriptSrc: [ "'self'", `*.${host}:*`, `http://*.${host}:*`, "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.fbcdn.net:*", "'sha256-b+bPlHI3Xupxz+xXVTazjfiOEv9to4g5ULdU6ZR+MKw='" ]
			, connectSrc: [ `ws://*.${host}:*`, `wss://*.${host}:*` ] // , "*.microsoftonline.com:*" ] -- for SharePoint
			, styleSrc: [ "'self'", "'unsafe-inline'" ]
			, childSrc: "*"
		}
		, toString() {
			return cspBuilder( { directives: this.directives } );
		}
	}
};

if ( process.env.URL ) _config.csp.directives.connectSrc.push( `ws://${process.env.URL.trim()}:*`, `wss://${process.env.URL.trim()}:*` );

if ( process.env.MOBILE ) _config.entry.vendor.push( // HACK: Must follow dependency sequence
	"jquery/src/core/init", "jquery/src/selector", "jquery/src/traversing", "jquery/src/callbacks", "jquery/src/deferred", "jquery/src/deferred/exceptionHook", "jquery/src/data", "jquery/src/queue", "jquery/src/queue/delay", "jquery/src/attributes", "jquery/src/event", "jquery/src/event/alias", "jquery/src/manipulation", "jquery/src/wrap", "jquery/src/css", "jquery/src/css/hiddenVisibleSelectors", "jquery/src/serialize", "jquery/src/ajax/load", "jquery/src/effects/animatedSelector", "jquery/src/offset", "jquery/src/dimensions", "jquery/src/deprecated", "jquery/src/exports/amd"
	, "underscore"
	, "backbone"
	, "backbone.marionette"
	, "react"
	, "react-dom"
	, "react-addons-pure-render-mixin"
	, "react-addons-transition-group"
	, "react-addons-css-transition-group"
	, "backbone-react-component/lib/component"
);
else {
	_config.entry[ "main.config" ] = "main.config";

	const config = require( "./package.json" );
	_config.plugins.push( new webpack.DefinePlugin( {
			__VER_BACKBONE__: JSON.stringify( `${config.devDependencies.backbone.substring(1) || ""}`.trim() )
			, __VER_BACKBONE_MARIONETTE__: JSON.stringify( `${config.devDependencies[ "backbone.marionette" ].substring(1) || ""}`.trim() )
			, __VER_BACKBONE_REACT__: JSON.stringify( `${config.devDependencies[ "backbone-react-component" ].substring(1) || ""}`.trim() )
			, __VER_JQUERY__: JSON.stringify( `${config.devDependencies.jquery.substring(1) || ""}`.trim() )
			, __VER_JQUERY_MOBILE__: JSON.stringify( `${config.devDependencies[ "jquery-mobile" ].substring(1) || ""}`.trim() )
			, __VER_POUCHDB__: JSON.stringify( `${config.dependencies.pouchdb.substring(1) || ""}`.trim() )
			, __VER_REACT__: JSON.stringify( `${config.devDependencies.react.substring(1) || ""}`.trim() )
			, __VER_REACT_DOM__: JSON.stringify( `${config.devDependencies[ "react-dom" ].substring(1) || ""}`.trim() )
			, __VER_UNDERSCORE__: JSON.stringify( `${config.dependencies.underscore.substring(1) || ""}`.trim() )
		} )
	);
	_config.externals = {
		backbone: "Backbone"
		, "backbone.marionette": "Marionette"
		, "backbone.react": "BackboneReactMixin"
		, jquery: "$"
		, pouchdb: "PouchDB"
		, react: "React"
		, "react-dom": "ReactDOM"
		, "requirejs": "requirejs"
		, underscore: "_"
	};
}

// TODO: function _getLoaders( loaders ) {
// 	let _loaders = [];
// 	for ( let key in loaders ) {
// 		if ( loaders.hasOwnProperty( key ) ) _loaders.push( `${key}?${typeof loaders[key] === "string" ? loaders[key] : loaders[key].join(",")}` );
// 	}

// 	return _loaders;
// }

module.exports = new Config().merge( _config );