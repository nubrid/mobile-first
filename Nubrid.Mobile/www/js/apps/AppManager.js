define(["backbone.marionette", "react", "backbone.react"], function (Marionette, React) {
	window.React = React;
	window.AppManager = new Marionette.Application({
		BackboneMixin: Backbone.React.Component.mixin
		, CommonModule: Marionette.Module.extend({
			startWithParent: false
		})
		, Config: {
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
				IO: { Root: window.protocol + window.host }
				, Web: window.protocol + window.host
			}
		}
		, changePage: function (options) {
			this.currentLayout = this.currentLayout && (this.currentLayout instanceof options.layout)
				? this.currentLayout.initialize(options)
				: new options.layout(options);
			$.mobile.initializePage();

			this.currentLayout.MainRegion.$el.pagecontainer("change", $(this.currentLayout.MainRegion.currentView.el), { reverse: options.reverse, transition: (options.transition ? options.transition : "slide"), allowSamePageTransition: true });
			if (options.url) AppManager.navigate(options.url);

			return this.currentLayout.MainRegion.currentView;
		}
		, connect: function (callback, closeOnOpen) {
			var primus = new Primus(AppManager.Config.Url.IO.Root, closeOnOpen ? _.extend(AppManager.Config.IO.Options, { strategy: "" }) : AppManager.Config.IO.Options);

			primus.open();
			primus.on("open", function () {
				console.log("connection established");
				if (callback) callback();
				if (closeOnOpen) this.end();
			});

			primus.on("error", function (error) {
				console.log(error);
			});

			return primus;
		}
		, currentRoute: function () {
			return Backbone.history.fragment;
		}
		, navigate: function (route, options) {
			options || (options = {});
			Backbone.history.navigate(route, options);
		}
		, net: function (callback) {
			if (_isDeviceOnline()) {
				callback();
				return;
			}
			else {
				this.connect(callback, true);
			}
		}
		, onStart: function () {
			// TODO: var attachHtml = Marionette.Region.prototype.attachHtml;
			Marionette.Region.prototype.attachHtml = function () {
				// TODO: this.attachHtml = attachHtml;
				//this.attachHtml.apply(this, arguments);

				//this.$el.enhanceWithin();
			};

			if (window.phonegap) {
				require(["cordova.loader"], function () {
					$(function () {
						document.addEventListener("deviceready", start, false);
					});
				});
			}
			else {
				start();
			}

			function start() {
				if (Backbone.history) {
					$(".back").on("click", function () {
						window.history.back();
						return false;
					});

					require(["apps/home/HomeApp", "apps/todos/TodosApp"], function (HomeApp, TodosApp) {
						HomeApp.start();
						TodosApp.start();

						Backbone.history.start();
					});
				}
			}
		}
		, toggleLoading: function (action) {
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
		}
	});

	function _isDeviceOnline() {
		return navigator.connection
			&& (navigator.connection.type == Connection.WIFI
			|| navigator.connection.type == Connection.CELL_2G
			|| navigator.connection.type == Connection.CELL_3G
			|| navigator.connection.type == Connection.CELL_4G
			|| navigator.connection.type == Connection.CELL
			|| navigator.connection.type == Connection.ETHERNET
			|| navigator.connection.type == Connection.UNKNOWN);
	}

	return AppManager;
});