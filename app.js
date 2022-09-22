/* jshint maxcomplexity: false, maxstatements: false */
(() => {
"use strict";
const _argv = require( "yargs" )
	.usage( "Usage: $0 [options]" )
	.example( "$0" )
	.example( "$0 -s" )
	.example( "$0 -s true" )
	.example( "$0 -s true -r https -c -p 443" )
	.options( {
		"c": {
			alias: "use-cluster"
			, describe: "Use node.js clustering"
			, nargs: 0
		}
		, "p": {
			alias: "port"
			, describe: "Listening port"
			, nargs: 1
		}
		, "r": {
			alias: "redirect"
			, describe: "Redirect to protocol:\nhttp\nhttps"
			, nargs: 1
		}
		, "s": {
			alias: "secure"
			, default: true
			, describe: "Use secure HTTPS protocol (default)"
			, nargs: 0
		}
	} )
	.boolean( [ "s" ] )
	.help( "h" )
	.alias( "h", "help" )
	.epilog( "copyright 2015" )
	.argv;

const _config = require( "./app.config" )
	, _cluster = require( "cluster" )
	, port = process.env.PORT
		|| _argv.p
		|| ( _argv.s
				? _config.web.sslPort
				: _config.web.port );

if ( _cluster.isMaster && ( _argv.c || _config.web.useCluster ) ) {
	// Fork workers.
	for ( let i = 0
		, numCPUs = require( "os" ).cpus().length
		, multiplier = port < 100 ? 100 : ( port < 1000 ? 10 : 1 );
		i < numCPUs; i++ ) {
		_cluster.fork( { PORT: i === 0 ? port : ( port * multiplier ) + i } );
	}

	_cluster.on( "exit", ( worker/*, code, signal*/ ) => console.log( `worker ${worker.process.pid} died` ) );
	module.exports = null;
}
else {
	const express = require( "express" )
		, router = express.Router();

	router.use( ( request, response, next ) => {
		const protocol = request.header( "x-forwarded-proto" ) || request.protocol
			, host = request.header( "host" );

		if ( _argv.s && `${protocol}:\/\/${host}\/` !== request.header( "referrer" ) && request.path.startsWith( "/js/" ) && !request.path.endsWith( ".map" ) ) {
			console.log( `CSRF: ${request.path} ${request.headers[ "user-agent" ]}` );
			response.send( "rainbows and unicorns!" );
			response.end();
			return;
		}

		request.sessionOptions.maxAge = request.session.maxAge || request.sessionOptions.maxAge; // cookie-session
		if ( _argv.r && _argv.r !== protocol ) {
			response.writeHead( 301, { "Location": `${_argv.r}:\/\/${host}${request.url}` } );
			response.end();

			return;
		}

		next();
	} );

	//router.get( "/*", ( request, response, next ) => {
	//	serve( request, response, next );
	//} );

	const passport = require( "passport" )
		, passportRedirect = {
			successRedirect: "/"
			, failureRedirect: "/#failed"
		};

	router.get( "/auth/facebook", passport.authenticate( "facebook", {
		display: "touch"
		//, scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	} ) );

	router.get( "/auth/facebook/callback", passport.authenticate( "facebook", passportRedirect ) );

	router.get( "/auth/twitter", passport.authenticate( "twitter", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	} ) );

	router.get( "/auth/twitter/callback", passport.authenticate( "twitter", passportRedirect ) );

	router.get( "/auth/linkedin", passport.authenticate( "linkedin", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	} ) );

	router.get( "/auth/linkedin/callback", passport.authenticate( "linkedin", passportRedirect ) );

	const FacebookStrategy = require( "passport-facebook" ).Strategy
		, TwitterStrategy = require( "passport-twitter" ).Strategy
		, LinkedInStrategy = require( "passport-linkedin" ).Strategy;

	passport.serializeUser( ( user, done ) => {
		done( null, user );
	} );

	passport.deserializeUser( ( obj, done ) => {
		done( null, obj );
	} );

	passport.use(
		new FacebookStrategy( {
			clientID: _config.fb.clientID
			, clientSecret: _config.fb.clientSecret
			, callbackURL: "/auth/facebook/callback"
		}
		, ( accessToken, refreshToken, profile, done ) => {
			console.log( profile );
			process.nextTick( () => done( null, profile ) );// {
				//return done( null, profile );
				//User.findOrCreate( null, ( err, user ) => {
				//	if ( err ) { return done( err ); }
				//	done( null, user );
				//} );
			//} );
		} )
	);

	passport.use(
		new TwitterStrategy( {
			consumerKey: _config.twit.consumerKey
			, consumerSecret: _config.twit.consumerSecret
			, callbackURL: "/auth/twitter/callback"
		}
		, ( token, tokenSecret, profile, done ) => {
			console.log( profile );
			return done( null, profile );
			//process.nextTick( () => {
				//User.findOrCreate( null, ( err, user ) => {
				//	if ( err ) { return done( err ); }
				//	done( null, user );
				//} );
			//} );
		} )
	);

	passport.use(
		new LinkedInStrategy( {
			consumerKey: _config.linkedin.consumerKey
			, consumerSecret: _config.linkedin.consumerSecret
			, callbackURL: "/auth/linkedin/callback"
		}
		, ( token, tokenSecret, profile, done ) => {
			console.log( profile );
			process.nextTick( () => done( null, profile ) );//{
				//return done( null, profile );
				//User.findOrCreate( { linkedinId: profile.id }, ( err, user ) => {
				//	return done( err, user );
				//} );
			//} );
		} )
	);

	const app = express()
		, compression = require( "compression" )
		, cookieParser = require( "cookie-parser" )
		, bodyParser = require( "body-parser" )
		, cookieSession = require( "cookie-session" )
		, helmet = require( "helmet" )
		, appCache = require( "connect-cache-manifest" );
		//, cookie = { secure: false }; // session

	app.use( compression() );
	app.use( cookieParser() );
	app.use( bodyParser.urlencoded( { extended: false } ) );
	app.use( bodyParser.json() );
	app.use( cookieSession( { secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513" } ) );
	//app.use( session( { secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513", resave: false, saveUninitialized: true, cookie: cookie } ) );

	app.use( passport.initialize() );
	app.use( passport.session() );

	app.use( helmet.frameguard() );
	app.use( helmet.hidePoweredBy() );
	app.use( helmet.hsts( { maxAge: _config.web.maxAge, includeSubdomains: true } ) );
	app.use( helmet.ieNoOpen() );
	app.use( helmet.noSniff() );
	app.use( helmet.xssFilter() );

	//app.use( helmet.contentSecurityPolicy( {
	//	defaultSrc: [ "'self'", "gap:", "https://ssl.gstatic.com" ],
	//	scriptSrc: [ "'self'", "*.nubrid.com:*", "http://*.nubrid.com:*", "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.akamaihd.net:*" ],
	//	imgSrc: [ "'self'", "data:" ],
	//	connectSrc: [ "ws://*.nubrid.com:*", "ws://nubrid.dlinkddns.com:*", "wss://*.nubrid.com:*", "wss://nubrid.dlinkddns.com:*" ],
	//	mediaSrc: [ "*" ],
	//	reportUri: "/report-violation",
	//	reportOnly: false, // set to true if you only want to report errors
	//	setAllHeaders: false, // set to true if you want to set all headers
	//	disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy)
	//	safari5: false // set to true if you want to force buggy CSP in Safari 5
	//} ) );
	// For helmet.contentSecurityPolicy()
	//router.post( "/report-violation", ( request, response ) => {
	//	if ( request.body ) {
	//		console.log( `CSP Violation: ${request.body}` );
	//	} else {
	//		console.log( "CSP Violation: No data received!" );
	//	}

	//	response.status( 204 ).end();
	//} );

	app.use( "/", router );

	let serve = null;

	if ( process.env.NODE_ENV === "production" ) {
		serve = require( "st" )( {
			path: _config.web.dir
			, index: "index.html"
			, cache: { content: { maxAge: _config.web.maxAge } }
			, gzip: true
			, passthrough: true
		} );

		app.set( "trust proxy", 1 );
		//cookie.secure = true; // session

		app.use( appCache( {
			manifestPath: "/.appcache"
			, cdn: [] // TODO: All CDN files specified in main.config.js
			, files: [ { dir: "src", prefix: "/", ignore: x => /(\.dev\.html|\.home\.html)$/.test(x) } ]
			, networks: [ "*" ]
			, fallbacks: []
		} ) );
	}
	else {
		const serveStatic = require( "serve-static" );
		serve = serveStatic( _config.web.dir, {
			index: "index.dev.html"
			//maxAge: _config.web.maxAge
			//, setHeaders: ( response, path ) => {
			//	if ( serveStatic.mime.lookup( path ) === "text/html" ) response.setHeader( "Cache-Control", "public, max-age=86400" );
			//}
		} );

		const webpack = require( "webpack" )
			, webpackConfig = require( "./webpack.config" )
			, webpackMidleware = require( "webpack-dev-middleware" );

		webpackConfig.output.path = "/";
		app.use( webpackMidleware( webpack( webpackConfig ), {
			publicPath: webpackConfig.output.publicPath
			, stats: {
				assets: true
				, chunks: true
				, chunkModules: false
				, colors: true
				, hash: false
				, timings: false
				, version: false
			}
		} ) );
	}

	app.use( serve );

	let options = null;

	if ( _argv.s ) {
		const fs = require( "fs" );
			//, constants = require( "constants" );

		options = {
			ca: [ fs.readFileSync( _config.web.sslCa ) ]
			, key: fs.readFileSync( _config.web.sslKey )
			, cert: fs.readFileSync( _config.web.sslCrt )
			// Default since v0.10.33, secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2
		};
	}

	let server = null
		, primus = null;
	(() => {
		const http = require( _argv.s ? "https" : "http" );
		http.globalAgent.maxSockets = _config.web.maxSockets;
		server = _argv.s ? http.createServer( options, app ) : http.createServer( app );

		let Primus = require( "primus.io" );
		primus = new Primus( server, { transformer: _config.primus.transformer } );
	})();

	const PouchDB = require( "pouchdb" )
		, proxyquire = require( "proxyquire" )

		, engineStub = {}
		, pouchServer = proxyquire( "socket-pouch/lib/server", { "engine.io": engineStub } )

		, encodingStub = {}
		, sqldown = proxyquire( "sqldown", { "./encoding": encodingStub } );

	// HACK: Override engine.io with primus
	engineStub.listen = () => primus;
	primus.on( "connection", spark => {
		spark.on( "data", message => {
			const sparkMessage = spark.emits( "message" );
			sparkMessage( message.data[ 0 ] );
		} );
	} );

	// HACK: Disable SQLDown encoding
	encodingStub.encode = ( value, isValue ) => isValue ? JSON.stringify( value ) : value;
	encodingStub.decode = ( value, isValue ) => isValue ? JSON.parse( value ) : value;

	const db = function SQLdown () {
		return sqldown( `postgres://songokou:P@ssw0rd@localhost/nubrid` );
	};
	db.destroy = sqldown.destroy;

	pouchServer.listen( 8000, { // HACK: Port is ignored
		pouchCreator( name ) {
			return new PouchDB( {
				name
				, db
				, table: "sqldown"
			} ).then( response => Object.assign( response, { pouch: response } ) ); // Return a promise with { pouch: <PouchDB Instance> }
		}
	} );

	// primus.use( "broadcast", require( "primus-broadcast" ) );

	// require( "babel-core/register" )( {
	// 	"plugins": [
	// 		"transform-es2015-function-name"
	// 	]
	// } );
	// const graphql = require( "./data/graphql" )
	// 	, Schema = require( "./data/schema" );

	// primus.on( "connection", spark => {
	// 	const operation = {
	// 		CREATE: "create"
	// 		, READ: "read"
	// 		, UPDATE: "update"
	// 		, DELETE: "delete"
	// 	};

	// 	//const extend = target => {
	// 	//	const sources = [].slice.call( arguments, 1 );
	// 	//	sources.forEach( source => {
	// 	//		for ( let prop in source ) {
	// 	//			if ( source[ prop ] ) target[ prop ] = source[ prop ];
	// 	//		}
	// 	//	} );
	// 	//	return target;
	// 	//}

	// 	const crud = ( event, data, url, callback ) => {
	// 		const query = event === operation.READ
	// 			? `${data.query}`
	// 			: `mutation Mutation {${event}}`;

	// 		const args = [
	// 			url
	// 			, data
	// 		];

	// 		if ( event === operation.UPDATE || event === operation.DELETE ) url = `${url}/${data.id}`;

	// 		if ( event === operation.READ ) args.splice( 1, 1 );

	// 		graphql( Schema, query, { args } ).then( result/*, response*/ => {
	// 			const data = ( event === operation.READ
	// 				? result.data[ url ]
	// 				: JSON.parse( result.data[ event ] )
	// 			);

	// 			if ( event !== operation.READ ) {
	// 				event = `${url}:${event}`;
	// 				spark.send( event, data );
	// 				spark.broadcast( event, data );
	// 			}

	// 			callback( null, data );
	// 		} );

	// 	};

	// 	console.log( `connected: ${spark.address.ip}` );

	// 	/*
	// 	Triggered when *.save() is called.
	// 	We listen on model namespace, but emit on the collection namespace.
	// 	*/
	// 	spark.on( `*:${operation.CREATE}`, ( data, url, callback ) => {
	// 		crud( operation.CREATE, data, url, callback );
	// 	} );

	// 	/*
	// 	Triggered when *.fetch() is called.
	// 	*/
	// 	spark.on( `*:${operation.READ}`, ( data, url, callback ) => {
	// 		crud( operation.READ, data, url, callback );
	// 	} );

	// 	/*
	// 	Triggered when *.save() is called.
	// 	*/
	// 	spark.on( `*:${operation.UPDATE}`, ( data, url, callback ) => {
	// 		crud( operation.UPDATE, data, url, callback );
	// 	} );

	// 	/*
	// 	Triggered when *.destroy() is called.
	// 	*/
	// 	spark.on( `*:${operation.DELETE}`, ( data, url, callback ) => {
	// 		crud( operation.DELETE, data, url, callback );
	// 	} );

	// 	spark.on( "end", () => console.log( `closed: ${spark.address.ip}` ) );
	// } );

	process.on( "uncaughtException", error => console.log(error) );

	server.listen( port );

	app.set( "port", port );
	app.set( "server", server );
	module.exports = app;
}
} )();