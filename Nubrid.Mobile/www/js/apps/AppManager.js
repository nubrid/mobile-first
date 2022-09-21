define(
["backbone.marionette"
, "text!templates/MasterPage.html"]
, function (Marionette, MasterPage) {
	window.AppManager = new Marionette.Application();

	var attachHtml = Marionette.Region.prototype.attachHtml;
	Marionette.Region.prototype.attachHtml = function (view) {
		this.attachHtml = attachHtml;
		this.attachHtml(view);

		this.$el.trigger("create");
	};

	AppManager.Config = {
		IO: {
			Options: {
				manual: true
				//, transport: {
				//	transports: [
				//		"websocket"
				//	]
				//}
			}
		}
		, Url: {
			IO: { Root: "http:" + window.host }
			, Web: "http:" + window.host
		}
	};

	AppManager.addRegions({
		MainRegion: "body"
	});

	AppManager.toggleLoading = function (action) {
		var $this = $(this)
			, theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme
			, msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text
			, textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible
			, textonly = !!$this.jqmData("textonly");
		html = $this.jqmData("html") || "";
		$.mobile.loading(action, {
			text: msgText,
			textVisible: textVisible,
			theme: theme,
			textonly: textonly,
			html: html
		});
	};

	AppManager.navigate = function (route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	AppManager.connect = function (callback) {
		var primus = new Primus(AppManager.Config.Url.IO.Root, AppManager.Config.IO.Options);

		primus.open();
		primus.on("open", function () {
			console.log("connection established");
			if (callback) callback();
		});

		primus.on("error", function (error) {
			console.log(error);
		});

		return primus;
	};

	AppManager.showRecaptcha = function (elId) {
		require(["recaptcha"], function () {
			Recaptcha.create(AppManager.Config.RecaptchaPublicKey, elId, {
				theme: "custom"
				, custom_theme_widget: elId
			});
		});
	};

	AppManager.getCurrentRoute = function () {
		return Backbone.history.fragment
	};

	AppManager.applyMasterPage = function (options) {
		var page = options.masterPage ? options.masterPage : MasterPage;

		if (options.main) page = page.replace("<!-- MainContent -->", options.main);
		if (options.header) page = page.replace("<!-- HeaderContent -->", options.header);
		if (options.footer) page = page.replace("<!-- FooterContent -->", options.footer);

		return page;
	};

	AppManager.changePage = function (view, isReverse) {
		page = new view();
		AppManager.MainRegion.show(page);
		$.mobile.initializePage();

		$("body").pagecontainer("change", page.$el, { reverse: isReverse, transition: "slide" });
		return page;
	};

	AppManager.on("start", function () {
		require(["detectmobilebrowser"], function () {
			if (!window.mobile) {
				start();
			}
			else {
				// HACK: Uncomment if phonegap is supported.
				//require(["cordova.loader"], function (navigator) {
					$(function () {
						document.addEventListener("deviceready", start, false);
					});
				//});
			}

			function start() {
				if (Backbone.history) {
					$(".back").on("click", function (event) {
						window.history.back();
						return false;
					});

					Backbone.history.start();

					if (AppManager.getCurrentRoute() === "") {
						AppManager.trigger("home:show");
					}
				}
			}
		});
	});

	return AppManager;
});