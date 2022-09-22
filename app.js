/* jshint maxcomplexity: false, maxstatements: false */
(() => {
"use strict";
let argv = require("yargs")
	.usage("Usage: $0 [options]")
	.example("$0")
	.example("$0 -s")
	.example("$0 -s true")
	.example("$0 -s true -r https -c -p 443")
	.options({
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
	})
	.boolean(["s"])
	.help("h")
	.alias("h", "help")
	.epilog("copyright 2015")
	.argv;

let config = require("./app.config")
	, cluster = require("cluster")
	, port = process.env.PORT
		|| argv.p
		|| ((argv.s
				? config.web.sslPort
				: config.web.port));

if (cluster.isMaster && (argv.c || config.web.useCluster)) {
	// Fork workers.
	for (let i = 0
		, numCPUs = require("os").cpus().length
		, multiplier = port < 100 ? 100 : (port < 1000 ? 10 : 1);
		i < numCPUs; i++) {
		cluster.fork({ PORT: (i === 0 ? port : (port * multiplier) + i) });
	}

	cluster.on("exit", (worker/*, code, signal*/) => {
		console.log(`worker ${worker.process.pid} died`);
	});
	module.exports = null;
}
else {
	let express = require("express")
		, router = express.Router();

	router.use((request, response, next) => {
		let protocol = request.header("x-forwarded-proto") || request.protocol
			, host = request.header("host");

		if (argv.s && `${protocol}:\/\/${host}\/` !== request.header("referrer") && request.path.startsWith("/js/") && !request.path.endsWith(".map")) {
			console.log(`CSRF: ${request.path} ${request.headers["user-agent"]}`);
			response.send("rainbows and unicorns!");
			response.end();
			return;
		}

		request.sessionOptions.maxAge = request.session.maxAge || request.sessionOptions.maxAge; // cookie-session
		if (argv.r && argv.r !== protocol) {
			response.writeHead(301, { "Location": `${argv.r}:\/\/${host}${request.url}` });
			response.end();

			return;
		}

		next();
	});

	//router.get("/*", (request, response, next) => {
	//	serve(request, response, next);
	//});

	let passport = require("passport")
		, passportRedirect = {
			successRedirect: "/"
			, failureRedirect: "/#failed"
		};

	router.get("/auth/facebook", passport.authenticate("facebook", {
		display: "touch"
		//, scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/facebook/callback", passport.authenticate("facebook", passportRedirect));

	router.get("/auth/twitter", passport.authenticate("twitter", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/twitter/callback", passport.authenticate("twitter", passportRedirect));

	router.get("/auth/linkedin", passport.authenticate("linkedin", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/linkedin/callback", passport.authenticate("linkedin", passportRedirect));

	let FacebookStrategy = require("passport-facebook").Strategy
		, TwitterStrategy = require("passport-twitter").Strategy
		, LinkedInStrategy = require("passport-linkedin").Strategy;

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});

	passport.use(
		new FacebookStrategy({
			clientID: config.fb.clientID
			, clientSecret: config.fb.clientSecret
			, callbackURL: "/auth/facebook/callback"
		}
		, (accessToken, refreshToken, profile, done) => {
			console.log(profile);
			process.nextTick(() => done(null, profile));//{
				//return done(null, profile);
				//User.findOrCreate(null, (err, user) => {
				//	if (err) { return done(err); }
				//	done(null, user);
				//});
			//});
		})
	);

	passport.use(
		new TwitterStrategy({
			consumerKey: config.twit.consumerKey
			, consumerSecret: config.twit.consumerSecret
			, callbackURL: "/auth/twitter/callback"
		}
		, (token, tokenSecret, profile, done) => {
			console.log(profile);
			return done(null, profile);
			//process.nextTick(() => {
				//User.findOrCreate(null, (err, user) => {
				//	if (err) { return done(err); }
				//	done(null, user);
				//});
			//});
		})
	);

	passport.use(
		new LinkedInStrategy({
			consumerKey: config.linkedin.consumerKey
			, consumerSecret: config.linkedin.consumerSecret
			, callbackURL: "/auth/linkedin/callback"
		}
		, (token, tokenSecret, profile, done) => {
			console.log(profile);
			process.nextTick(() => done(null, profile));//{
				//return done(null, profile);
				//User.findOrCreate({ linkedinId: profile.id }, (err, user) => {
				//	return done(err, user);
				//});
			//});
		})
	);

	let app = express()
		, compression = require("compression")
		, cookieParser = require("cookie-parser")
		, bodyParser = require("body-parser")
		, cookieSession = require("cookie-session")
		, helmet = require("helmet");
		//, session = require("express-session")
		//, cookie = { secure: false }; // session

	app.use(compression());
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cookieSession({ secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513" }));
	//app.use(session({ secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513", resave: false, saveUninitialized: true, cookie: cookie }));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(helmet.frameguard());
	app.use(helmet.hidePoweredBy());
	app.use(helmet.hsts({ maxAge: config.web.maxAge, includeSubdomains: true }));
	app.use(helmet.ieNoOpen());
	app.use(helmet.noSniff());
	app.use(helmet.xssFilter());

	//app.use(helmet.contentSecurityPolicy({
	//	defaultSrc: ["'self'", "gap:", "https://ssl.gstatic.com"],
	//	scriptSrc: ["'self'", "*.nubrid.com:*", "http://*.nubrid.com:*", "*.cloudflare.com:*", "*.googleapis.com:*", "fb.me:*", "*.akamaihd.net:*"],
	//	imgSrc: ["'self'", "data:"],
	//	connectSrc: ["ws://*.nubrid.com:*", "ws://nubrid.dlinkddns.com:*", "wss://*.nubrid.com:*", "wss://nubrid.dlinkddns.com:*"],
	//	mediaSrc: ["*"],
	//	reportUri: "/report-violation",
	//	reportOnly: false, // set to true if you only want to report errors
	//	setAllHeaders: false, // set to true if you want to set all headers
	//	disableAndroid: false, // set to true if you want to disable Android (browsers can vary and be buggy)
	//	safari5: false // set to true if you want to force buggy CSP in Safari 5
	//}));
	// For helmet.contentSecurityPolicy()
	//router.post("/report-violation", (request, response) => {
	//	if (request.body) {
	//		console.log(`CSP Violation: ${request.body}`);
	//	} else {
	//		console.log("CSP Violation: No data received!");
	//	}

	//	response.status(204).end();
	//});

	app.use("/", router);

	let serve = null;

	if (process.env.NODE_ENV === "production") {
		serve = require("st")({
			path: config.web.dir
			, index: "index.html"
			, cache: { content: { maxAge: config.web.maxAge } }
			, gzip: true
			, passthrough: true
		});

		app.set("trust proxy", 1);
		//cookie.secure = true; // session
	}
	else {
		let serveStatic = require("serve-static");
		serve = serveStatic(config.web.dir, {
			index: "index.dev.html"
			//maxAge: config.web.maxAge
			//, setHeaders: (response, path) => {
			//	if (serveStatic.mime.lookup(path) === "text/html") response.setHeader("Cache-Control", "public, max-age=86400");
			//}
		});
	}

	app.use(serve);

	let options = null;

	if (argv.s) {
		let fs = require("fs");
			//, constants = require("constants");

		options = {
			ca: [fs.readFileSync(config.web.sslCa)]
			, key: fs.readFileSync(config.web.sslKey)
			, cert: fs.readFileSync(config.web.sslCrt)
			// Default since v0.10.33, secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2
		};
	}
	
	let server = null
		, primus = null;
		// TODO: node-rest-client
		// , client = null;
	{
		let http = require(argv.s ? "https" : "http");
		http.globalAgent.maxSockets = config.web.maxSockets;
		server = argv.s ? http.createServer(options, app) : http.createServer(app);
	
		let Primus = require("primus.io");
		primus = new Primus(server, { transformer: config.primus.transformer });

		// TODO: node-rest-client
		// let Client = require("node-rest-client").Client;
		// client = new Client();
	}

	primus.use("broadcast", require("primus-broadcast"));

	require("babel-core/register");
	let graphql = require("./data/graphql.js")
		, Schema = require("./data/schema.js");

	primus.on("connection", (spark) => {
		let _operation = {
			CREATE: "create"
			, READ: "read"
			, UPDATE: "update"
			, DELETE: "delete"
		};

		//let extend = (target) => {
		//	let sources = [].slice.call(arguments, 1);
		//	sources.forEach((source) => {
		//		for (let prop in source) {
		//			if (source[prop]) target[prop] = source[prop];
		//		}
		//	});
		//	return target;
		//}

		//let useragent = require("express-useragent");
		let crud = (event, data, url, callback) => {
			let query = event === _operation.READ
				? `${data.query}`
				: `mutation Mutation {${event}}`;

			let _args = [
				url
				, data
			];

			if (event === _operation.UPDATE || event === _operation.DELETE) url = `${url}/${data.id}`;
			// TODO: node-rest-client
			// let _args = [
			// 	`${config.api.url}/${url}`
			// 	, {
			// 		data: JSON.stringify(data),//JSON.stringify(extend({}, data, useragent.parse(spark.headers["user-agent"]))),
			// 		headers: { "Content-Type": "application/json" }
			// 	}
			// ];

			let _callback = result/*, response*/ => {
				let data = event === _operation.READ
					? result.data[url]
					: JSON.parse(result.data[event]);

				if (event !== _operation.READ) {
					event = `${url}:${event}`;
					spark.send(event, data);
					spark.broadcast(event, data);
				}

				callback(null, data);
			};

			if (event === _operation.READ) _args.splice(1, 1);

			graphql(Schema, query, {args: _args}).then(_callback);

			// switch (event) {
			// 	case _operation.CREATE:
			// 		client.post.apply(this, _args);
			// 		break;
			// 	case _operation.READ:
			// 		client.get.apply(this, _args);
			// 		break;
			// 	case _operation.UPDATE:
			// 		client.put.apply(this, _args);
			// 		break;
			// 	case _operation.DELETE:
			// 		client.delete.apply(this, _args);
			// 		break;
			// }
		};

		console.log(`connected: ${spark.address.ip}`);

		/*
		Temp DB
		*/
		// TODO: node-rest-client
		// let Seed = require("seed")
		// 	, guid = new Seed.ObjectId();
		/*
		Temp DB
		*/

		/*
		Triggered when *.save() is called.
		We listen on model namespace, but emit on the collection namespace.
		*/
		spark.on(`*:${_operation.CREATE}`, (data, url, callback) => {
			// TODO: node-rest-client
			// data.id = guid.gen();
			crud(_operation.CREATE, data, url, callback);
		});

		/*
		Triggered when *.fetch() is called.
		*/
		spark.on(`*:${_operation.READ}`, (data, url, callback) => {
			crud(_operation.READ, data, url, callback);
		});

		/*
		Triggered when *.save() is called.
		*/
		spark.on(`*:${_operation.UPDATE}`, (data, url, callback) => {
			crud(_operation.UPDATE, data, url, callback);
		});

		/*
		Triggered when *.destroy() is called.
		*/
		spark.on(`*:${_operation.DELETE}`, (data, url, callback) => {
			crud(_operation.DELETE, data, url, callback);
		});

		// TODO: Sample postgres
		//spark.on("getById", (userId, callback) => {
		//	let pg = require("pg");
		//	let connString = "tcp://postgres:Password1@localhost:5432/ThreeDegree";
		//	let client = new pg.Client(connString);
		//	client.connect();

		//	let query = client.query('SELECT "ID", "FirstName", "LastName", "Email" FROM "3"."User" WHERE "ID" = $1', [userId]);

		//	query.on("row", row => {
		//		callback(row);
		//	});

		//	query.on("end", () => { client.end(); });
		//});

		spark.on("end", () => {
			console.log(`closed: ${spark.address.ip}`);
		});
	});

	process.on("uncaughtException", error => {
		console.log(error);
	});

	server.listen(port);

	app.set("port", port);
	app.set("server", server);
	module.exports = app;
}
})();