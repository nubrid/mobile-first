const webpack = require( "webpack" )
	, { Config } = require( "webpack-config" )
	, cspBuilder = require( "content-security-policy-builder" )
	, fs = require( "fs" )
	, LodashWebpackPlugin = require( "lodash-webpack-plugin" )
	, path = require( "path" )
	, _appConfig = require( "./app.config" )
	, _getDirectories = ( sourcePath, filterRegex ) =>
		fs.readdirSync( sourcePath ).filter( file => // eslint-disable-line lodash/prefer-lodash-method
			filterRegex.test( file ) && fs.statSync( path.join( sourcePath, file ) ).isDirectory()
		)
	, _host = _appConfig.web.host;

const _primus = new (require( "primus.io" ))( new ( require( "events" ) ).EventEmitter(), { transformer: _appConfig.primus.transformer });
_primus.save( path.resolve( "dist/primus.io.js" ) );

const _config = {
	entry: {
		main: "main"
		, vendor: [ // HACK: Must follow dependency sequence
			"./modernizr-config.json"
			// TODO: , "jquery/src/core/init", "jquery/src/selector", "jquery/src/traversing", "jquery/src/callbacks", "jquery/src/deferred", "jquery/src/deferred/exceptionHook", "jquery/src/data", "jquery/src/queue", "jquery/src/queue/delay", "jquery/src/attributes", "jquery/src/event", "jquery/src/event/alias", "jquery/src/manipulation", "jquery/src/wrap", "jquery/src/css", "jquery/src/css/hiddenVisibleSelectors", "jquery/src/serialize", "jquery/src/ajax/load", "jquery/src/effects/animatedSelector", "jquery/src/offset", "jquery/src/dimensions", "jquery/src/deprecated", "jquery/src/exports/amd"
			// , "underscore"
			, "backbone"
			// TODO: , "backbone.marionette"
			, "react"
			, "react-dom"
			// TODO: , "react-addons-pure-render-mixin"
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
		new webpack.ContextReplacementPlugin( /apps$/, new RegExp( `^\.\/(${_getDirectories( "script/js/apps", /^(?!common).*$/ ).join( "|" )})\/index.js$` ) )
		, new webpack.DefinePlugin( {
			__MOBILE__: JSON.stringify( JSON.parse( process.env.MOBILE || "false" ) )
			, __URL__: JSON.stringify( `${process.env.URL || ""}`.trim() )
		} )
		, new webpack.IgnorePlugin( /^cordova|jquery$/ ) // HACK: For backbone to work, ignore jquery
		, new webpack.ProvidePlugin( {
			AppManager: "apps/common"
			// TODO: , _: "underscore"
			// , $: "jquery"
			// , jQuery: "jquery"
			, Backbone: "backbone"
			, BackboneImmutable: "immutable-backbone"
			// TODO: , BackbonePouch: "backbone-pouch"
			, BackboneReactMixin: "backbone.react"
			// TODO: , Marionette: "backbone.marionette"
			, Modernizr: path.resolve( "modernizr-config.json" )
			// TODO: , PouchDB: "pouchdb"
			// , Primus: "primus.io.js"
			, React: "react"
			, ReactDOM: "react-dom"
			, ReactCSSTransitionGroup: "react-addons-css-transition-group"
			// TODO: , ReactPureRenderMixin: "react-addons-pure-render-mixin"
			, ReactRedux: "react-redux"
			, ReactTransitionGroup: "react-addons-transition-group"
			, Redux: "redux"
			// , requirejs: "requirejs"

			, chai: "chai"
			, sinon: "sinon/pkg/sinon"
		} )
		, new LodashWebpackPlugin( { // HACK: If backbone fails, add lodash features
			"caching": false
			, "chaining": false
			, "cloning": true
			, "coercions": false
			, "collections": true
			, "currying": false
			, "deburring": false
			, "exotics": false
			, "flattening": false
			, "guards": false
			, "memoizing": false
			, "metadata": false
			, "paths": true
			, "placeholders": false
			, "shorthands": false
			, "unicode": false
		})
	]
	, resolve: {
		root: [ path.resolve( "script/js" ) ]
		// TODO: , extensions: [ "", ".js", ".json", ".coffee" ]
		, modulesDirectories: [ "node_modules", "dist" ]
		, alias: {
			// TODO: Remove - "backbone.iosync": "backbone.iobind/lib/sync"
			"backbone.react$": "backbone-react-component/lib/component"
			, "cordova": "../cordova" // TODO: requirejs
			// TODO: , "jquery$": "jquery/src/core"
			// , "jquery.mobile$": "jquery.mobile/dist/jquery.mobile"
			, "pouchdb$": "libs/pouchdb"
			, "pouchdb-socket$": "socket-pouch/lib/client"
			, "primus.io$": "primus.io.js"
			// TODO: , "requirejs$": "exports?requirejs!requirejs/require"
			, "underscore": "libs/lodash"
		}
	}
	, module: {
		loaders: [
			{ test: /\.jsx?$/, loader: "babel"
				, exclude: /(dist|node_modules|bower_components)/
				, query: {
					plugins: [
						// TODO: "add-module-exports"
						"lodash"
						, "transform-class-properties"
						, "transform-es2015-modules-simple-commonjs" // HACK: Until webpack v2 is released
						, "transform-object-rest-spread"
						, "transform-runtime"
					]
					, cacheDirectory: true
				}
			}
			, { test: /\.(png|jpg)$/, loader: "url?limit=8192" }
			, { test: /\.css$/, loader: "style!css" }
			, { test: /\.less$/, loader: "style!css!less" } // TODO: Use LESS for CSS

			, { test: /backbone\.js$/, loader: "imports?define=>false" } // HACK: For backbone to work
			, { test: /modernizr-config\.json$/, loader: "modernizr" }

			, { test: /\.coffee$/, loader: "coffee" }
			, { test: /sinon.*\.js$/, loader: "imports?define=>false,require=>false" }
		]
		, noParse: [
			// TODO: /jquery\.mobile/
			/*, *//primus\.io/

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