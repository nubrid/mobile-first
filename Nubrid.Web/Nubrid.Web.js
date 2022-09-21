var config = require("./Nubrid.Web.Config")
	, passport = require("passport")
	, FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
	new FacebookStrategy({
		clientID: config.fb.appId
				, clientSecret: config.fb.appSecret
				, callbackURL: "/auth/facebook/callback"
	}
	, function (accessToken, refreshToken, profile, done) {
		User.findOrCreate(null, function (err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	})
);

var app = require("express")();

app.get("/auth/facebook"
	, passport.authenticate("facebook", {
		//scope: [
		//	"read_stream"
		//	, "publish_actions"
		//]
	})
);

app.get("/auth/facebook/callback"
	, passport.authenticate("facebook", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

app.listen(8080);
console.log("Listening at port 8080");

/*var express = require("express")
	, everyauth = require("everyauth")
	, config = require("./nubrid.ThreeDegree.Web.Config")
	, usersById = {}
	, nextUserId = 0
	, usersByFbId = {}
	, usersByTwitId = {}
	, usersByLinkedinId = {};

everyauth.debug = true;

everyauth.everymodule.findUserById(function (id, callback) {
	callback(null, usersById[id]);
});

everyauth.facebook
	.mobile(true)
	.scope("email")
	.appId(config.fb.appId)
	.appSecret(config.fb.appSecret)
	.findOrCreateUser(function (session, accessToken, accessSecret, user) {
		return usersByFbId[user.id] || (usersByFbId[user.id] = addUser("facebook", user));
	})
	.redirectPath("/");

everyauth.twitter
	.consumerKey(config.twit.consumerKey)
	.consumerSecret(config.twit.consumerSecret)
	.findOrCreateUser(function (session, accessToken, accessSecret, user) {
		return usersByFbId[user.id] || (usersByFbId[user.id] = addUser("twitter", user));
	})
	.redirectPath("/");

everyauth.linkedin
	.consumerKey(config.linkedin.apiKey)
	.consumerSecret(config.linkedin.apiSecret)
	.findOrCreateUser(function (session, accessToken, accessSecret, user) {
		return usersByFbId[user.id] || (usersByFbId[user.id] = addUser("linkedin", user));
	})
	.redirectPath("/");

var app = express.createServer(
	express.bodyParser()
	, express.static(__dirname + "/public")
	, express.favicon()
	, express.cookieParser()
	, express.session({ secret: "FD08243D-D9F2-46BA-BA19-3747B2D880AB" })
	, everyauth.middleware()
);

app.configure(function () {
	app.set("view engine", "jade");
	app.set("views", __dirname + "\\views");
	app.use("/scripts", express.static(__dirname + "\\scripts"));
});

app.get("/", function (req, res) {
	if (req.loggedIn) {
		res.redirect("/#" + req.user.email);
		return;
	}

	res.render("home");
});

everyauth.helpExpress(app);

module.exports = app;

function addUser(source, sourceUser) {
	var user;
	if (arguments.length === 1) {
		user = sourceUser = source;
		user.id = ++nextUserId;
		return usersById[nextUserId] = user;
	}
	else {
		user = usersById[++nextUserId] = { id: nextUserId, email: sourceUser.email };
		user[source] = sourceUser;
	}
	return user;
}

app.listen(80);
console.log("Listening at port 80");*/