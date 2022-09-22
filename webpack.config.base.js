const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, fs = require( "fs" )
	, path = require( "path" )
	, cspBuilder = require( "content-security-policy-builder" )
	, _appConfig = require( "./app.config" )
	, _host = _appConfig.web.host
	, _getDirectories = ( sourcePath, filterRegex ) =>
		fs.readdirSync( sourcePath ).filter( file =>
			filterRegex.test( file ) && fs.statSync( path.join( sourcePath, file ) ).isDirectory()
		);

const _primus = new require( "primus.io" )( new ( require( "events" ) ).EventEmitter(), { transformer: _appConfig.primus.transformer });
_primus.save( path.resolve( "dist/primus.io.js" ) );

const _config = {
	entry: {
		main: "main"
		, vendor: [ // HACK: Must follow dependency sequence
			"./modernizr-config.json"
			, "jquery/src/core/init", "jquery/src/selector", "jquery/src/traversing", "jquery/src/callbacks", "jquery/src/deferred", "jquery/src/deferred/exceptionHook", "jquery/src/data", "jquery/src/queue", "jquery/src/queue/delay", "jquery/src/attributes", "jquery/src/event", "jquery/src/event/alias", "jquery/src/manipulation", "jquery/src/wrap", "jquery/src/css", "jquery/src/css/hiddenVisibleSelectors", "jquery/src/serialize", "jquery/src/ajax/load", "jquery/src/effects/animatedSelector", "jquery/src/offset", "jquery/src/dimensions", "jquery/src/deprecated", "jquery/src/exports/amd"
			, "underscore"
			, "backbone"
			, "backbone.marionette"
			, "react"
			, "react-dom"
			, "react-addons-pure-render-mixin"
			, "react-addons-transition-group"
			, "react-addons-css-transition-group"
			, "backbone.react"
		]
	}
	, output: {
		path: "src"
		, publicPath: "/"
		, filename: "js/[name].js"
	}
	, plugins: [
		new webpack.DefinePlugin( {
			__MOBILE__: JSON.stringify( JSON.parse( process.env.MOBILE || "false" ) )
			, __URL__: JSON.stringify( `${process.env.URL || ""}`.trim() )
		} )
		, new webpack.ContextReplacementPlugin( /apps$/, new RegExp( `^\.\/(${_getDirectories( "script/js/apps", /^(?!common).*$/ ).join( "|" )})\/show\/App\.js$` ) )
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
			, Primus: "primus.io.js"
			, React: "react"
			, ReactDOM: "react-dom"
			, ReactCSSTransitionGroup: "react-addons-css-transition-group"
			, ReactPureRenderMixin: "react-addons-pure-render-mixin"
			, ReactTransitionGroup: "react-addons-transition-group"
			// , requirejs: "requirejs"

			, chai: "chai"
			, sinon: "sinon/pkg/sinon"
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
			// , "requirejs$": "exports?requirejs!requirejs/require"
		}
	}
	, module: {
		loaders: [
			{ test: /\.jsx?$/, loader: "babel"
				, exclude: /(libs|dist|node_modules|bower_components)/
				, query: {
					plugins: [
						"add-module-exports"
						, "transform-runtime"
						, "transform-es2015-modules-commonjs" // HACK: Until webpack v2 is released
					]
					, cacheDirectory: true
				}
			}
			, { test: /\.coffee$/, loader: "coffee" }
			, { test: /modernizr-config\.json$/, loader: "modernizr" }
			, { test: /\.(png|jpg)$/, loader: "url?limit=8192" }
			, { test: /\.css$/, loader: "style!css" }
			, { test: /\.less$/, loader: "style!css!less" } // TODO: Use LESS for CSS

			, { test: /sinon.*\.js$/, loader: "imports?define=>false,require=>false" }
		]
		, noParse: [
			/jquery\.mobile/
			, /primus\.io/

			, /sinon\/pkg\/sinon/
		]
	}
	, csp: {
		directives: {
			defaultSrc: [ "'self'", "gap:", "https://ssl.gstatic.com" ]
			, mediaSrc: "*"
			, imgSrc: [ "'self'", "data:" ]
			, scriptSrc: [ "'self'", `*.${_host}:*`, `http://*.${_host}:*` ] // TODO: , "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.fbcdn.net:*", "'sha256-b+bPlHI3Xupxz+xXVTazjfiOEv9to4g5ULdU6ZR+MKw='" ]
			, connectSrc: [ `ws://*.${_host}:*`, `wss://*.${_host}:*` ] // , "*.microsoftonline.com:*" ] -- for SharePoint
			, styleSrc: [ "'self'", "'unsafe-inline'" ]
			, childSrc: "*"
		}
		, toString() {
			return cspBuilder( { directives: this.directives } );
		}
	}
};

if ( process.env.URL ) _config.csp.directives.connectSrc.push( `ws://${process.env.URL.trim()}:*`, `wss://${process.env.URL.trim()}:*` );

module.exports = new Config().merge( _config );