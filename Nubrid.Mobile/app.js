(function(){
"use strict";
var argv = require("yargs")
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

var config = require("./app.config")
	, cluster = require("cluster")
	, protocol = argv.s ? "https" : "http"
	, redirect = argv.r
	, useCluster = argv.c ? argv.c : config.web.useCluster
	, port = process.env.PORT
		? process.env.PORT
		: argv.p
			? argv.p
			: ((argv.s
				? config.web.sslPort
				: config.web.port));

if (cluster.isMaster && useCluster) {
	// Fork workers.
	var numCPUs = require("os").cpus().length
		, multiplier = port < 100 ? 100 : (port < 1000 ? 10 : 1);
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork({ PORT: (i === 0 ? port : (port * multiplier) + i) });
	}

	cluster.on("exit", function (worker/*, code, signal*/) {
		console.log("worker " + worker.process.pid + " died");
	});
	module.exports = null;
}
else {
	var passport = require("passport")
	, FacebookStrategy = require("passport-facebook").Strategy
	, TwitterStrategy = require("passport-twitter").Strategy
	, LinkedInStrategy = require("passport-linkedin").Strategy;

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});

	passport.use(
		new FacebookStrategy({
			clientID: config.fb.clientID
			, clientSecret: config.fb.clientSecret
			, callbackURL: "/auth/facebook/callback"
		}
		, function (accessToken, refreshToken, profile, done) {
			console.log(profile);
			process.nextTick(function () {
				return done(null, profile);
				//User.findOrCreate(null, function (err, user) {
				//	if (err) { return done(err); }
				//	done(null, user);
				//});
			});
		})
	);

	passport.use(
		new TwitterStrategy({
			consumerKey: config.twit.consumerKey
			, consumerSecret: config.twit.consumerSecret
			, callbackURL: "/auth/twitter/callback"
		}
		, function (token, tokenSecret, profile, done) {
			console.log(profile);
			return done(null, profile);
			//process.nextTick(function () {
				//User.findOrCreate(null, function(err, user) {
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
		, function (token, tokenSecret, profile, done) {
			console.log(profile);
			process.nextTick(function () {
				return done(null, profile);
				//User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
				//	return done(err, user);
				//});
			});
		})
	);

	var options = null;

	if (argv.s) {
		var fs = require("fs");
			//, constants = require("constants");

		options = {
			ca: [fs.readFileSync(config.web.sslCa)]
			, key: fs.readFileSync(config.web.sslKey)
			, cert: fs.readFileSync(config.web.sslCrt)
			// Default since v0.10.33, secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2
		};
	}

	var express = require("express")
		, app = express()
		, compression = require("compression")
		, cookieParser = require("cookie-parser")
		, bodyParser = require("body-parser")
		//, session = require("express-session")
		, cookieSession = require("cookie-session")
		, helmet = require("helmet")
		, router = express.Router();
		//, cookie = { secure: false }; // session
	var serve = null;

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
		var serveStatic = require("serve-static");
	} else {
			serve = serveStatic(config.web.dir, {
				//maxAge: config.web.maxAge
				//, setHeaders: function (response, path) {
				//	if (serveStatic.mime.lookup(path) === "text/html") response.setHeader("Cache-Control", "public, max-age=86400");
				//}
			});
	}
	
	app.use(compression());
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	//app.use(session({ secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513", resave: false, saveUninitialized: true, cookie: cookie }));
	app.use(cookieSession({ secret: "8AC782B6-0219-499B-A8EF-ABAE4325C513" }));
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
	//router.post("/report-violation", function (request, response) {
	//	if (request.body) {
	//		console.log("CSP Violation: ", request.body);
	//	} else {
	//		console.log("CSP Violation: No data received!");
	//	}

	//	response.status(204).end();
	//});

	router.use(function (request, response, next) {
		var protocol = request.headers["x-forwarded-proto"] ? request.headers["x-forwarded-proto"] : request.protocol
			, host = request.header("host")
			, referrer = request.header("referrer");

		if (argv.s && request.path.indexOf("/js/") === 0 && request.path.substring(request.path.length - 4) !== ".map" && (protocol + "://" + host + "/") !== referrer) {
			console.log("CSRF: ", request.path, request.headers["user-agent"]);
			response.send("rainbows and unicorns!");
			response.end();
			return;
		}

		request.sessionOptions.maxAge = request.session.maxAge || request.sessionOptions.maxAge; // cookie-session
		if (redirect && redirect !== protocol) {
			response.writeHead(301, { "Location": redirect + "://" + host + request.url });
			response.end();

			return;
		}

		next();
	});

	//router.get("/*", function (request, response, next) {
	//	serve(request, response, next);
	//});

	router.get("/auth/facebook", passport.authenticate("facebook", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/facebook/callback", passport.authenticate("facebook", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	router.get("/auth/twitter", passport.authenticate("twitter", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/twitter/callback", passport.authenticate("twitter", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	router.get("/auth/linkedin", passport.authenticate("linkedin", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	}));

	router.get("/auth/linkedin/callback", passport.authenticate("linkedin", {
		successRedirect: "/",
		failureRedirect: "/#failed"
	}));

	app.use("/", router);
	app.use(serve);

	/*
	Temp DB
	*/
	var Seed = require("seed")
		, guid = new Seed.ObjectId();
	//	, App = {};

	//App.Todo = Seed.Model.extend("todos", {
	//	schema: new Seed.Schema({
	//		title: String
	//		, completed: Boolean
	//	})
	//});

	//App.Todos = Seed.Graph.extend({
	//	initialize: function () {
	//		this.define(App.Todo);
	//	}
	//});

	//var db = new App.Todos();
	/*
	Temp DB
	*/

	var http = require(protocol)
		, server = argv.s ? http.createServer(options, app) : http.createServer(app);

	http.globalAgent.maxSockets = config.web.maxSockets;

	var Primus = require("primus.io")
		, primus = new Primus(server, { transformer: config.primus.transformer });

	primus.use("broadcast", require("primus-broadcast"));

	//var useragent = require("express-useragent");
	var Client = require("node-rest-client").Client
		, client = new Client();

	primus.on("connection", function (spark) {
		var _operation = {
			CREATE: "create"
			, READ: "read"
			, UPDATE: "update"
			, DELETE: "delete"
		};

		function crud(event, data, url, callback) {
			//var data = JSON.stringify(extend({}, data, useragent.parse(spark.headers["user-agent"])));
			var args = {
				data: JSON.stringify(data),
				headers: { "Content-Type": "application/json" }
			};

			if (event === _operation.UPDATE || event === _operation.DELETE) url = url + "/" + data.id;

			var _args = [
				config.api.url + "/" + url
				, function (data/*, response*/) {
					data = JSON.parse(data);

					if (event !== _operation.READ) {
						event = url + ":" + event;
						spark.send(event, data);
						spark.broadcast(event, data);
					}

					callback(null, data);
				}
			];

			if (event !== _operation.READ) _args.splice(1, 0, args);

			switch (event) {
				case _operation.CREATE:
					client.post.apply(this, _args);
					break;
				case _operation.READ:
					client.get.apply(this, _args);
					break;
				case _operation.UPDATE:
					client.put.apply(this, _args);
					break;
				case _operation.DELETE:
					client.delete.apply(this, _args);
					break;
			}
		}

		//function extend(target) {
		//	var sources = [].slice.call(arguments, 1);
		//	sources.forEach(function (source) {
		//		for (var prop in source) {
		//			if (source[prop]) target[prop] = source[prop];
		//		}
		//	});
		//	return target;
		//}

		console.log("connected:", spark.address.ip);

		/*
		Triggered when *.save() is called.
		We listen on model namespace, but emit on the collection namespace.
		*/
		spark.on("*:" + _operation.CREATE, function (data, url, callback) {
			data.id = guid.gen();
			crud(_operation.CREATE, data, url, callback);
		});

		/*
		Triggered when *.fetch() is called.
		*/
		spark.on("*:" + _operation.READ, function (data, url, callback) {
			crud(_operation.READ, data, url, callback);
		});

		/*
		Triggered when *.save() is called.
		*/
		spark.on("*:" + _operation.UPDATE, function (data, url, callback) {
			crud(_operation.UPDATE, data, url, callback);
		});

		/*
		Triggered when *.destroy() is called.
		*/
		spark.on("*:" + _operation.DELETE, function (data, url, callback) {
			crud(_operation.DELETE, data, url, callback);
		});

		// TODO: Sample postgres
		//spark.on("getById", function (userId, callback) {
		//	var pg = require("pg");
		//	var connString = "tcp://postgres:Password1@localhost:5432/ThreeDegree";
		//	var client = new pg.Client(connString);
		//	client.connect();

		//	var query = client.query('SELECT "ID", "FirstName", "LastName", "Email" FROM "3"."User" WHERE "ID" = $1', [userId]);

		//	query.on("row", function (row) {
		//		callback(row);
		//	});

		//	query.on("end", function () { client.end(); });
		//});

		spark.on("end", function () {
			console.log("closed:", spark.address.ip);
		});
	});

	process.on("uncaughtException", function (error) {
		console.log(error);
	});

	server.listen(port);

	app.set("port", port);
	app.set("server", server);
	module.exports = app;
}
}());