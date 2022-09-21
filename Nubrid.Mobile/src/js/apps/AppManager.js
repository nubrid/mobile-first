define(["backbone.marionette", "react", "backbone.react"], function (Marionette, React) {
	"use strict";
	window.React = React;
	var _appManager = new Marionette.Application({
		BackboneMixin: Backbone.React.Component.mixin
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

			// TODO: Using React Animation
			//this.currentLayout.MainRegion.$el.pagecontainer("change", $(this.currentLayout.MainRegion.currentView.el), { reverse: options.reverse, transition: (options.transition ? options.transition : "slide"), allowSamePageTransition: true });
			if (options.url) _appManager.navigate(options.url);

			return this.currentLayout.MainRegion.currentView;
		}
		, connect: function (options) {
			if (_.isFunction(options)) {
				options = { callback: options };
			}

			var primus = options.socket
				? options.socket
				: new Primus(_appManager.Config.Url.IO.Root, options.closeOnOpen
					? _.extend(_appManager.Config.IO.Options, { strategy: "" })
					: _appManager.Config.IO.Options);

			function primus_onOpen() {
				if (options.callback) options.callback();
				if (options.closeOnOpen) {
					primus.end();
				}
			}

			if (primus.readyState === Primus.OPEN) {
				primus_onOpen();

				return primus;
			}

			if (primus.readyState !== Primus.OPENING) primus.open();
			primus.on("open", function () {
				console.log("connection established");
				primus_onOpen();
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
			Backbone.history.navigate(route, options);
		}
		, net: function (callback) {
			if (_isDeviceOnline()) {
				callback();
				return;
			}
			else {
				this.connect({ callback: callback, closeOnOpen: true });
			}
		}
		, onStart: function () {
			// TODO: var attachHtml = Marionette.Region.prototype.attachHtml;
			Marionette.Region.prototype.attachHtml = function () {
				// TODO: this.attachHtml = attachHtml;
				//this.attachHtml.apply(this, arguments);

				//this.$el.enhanceWithin();
			};

			function start() {
				if (Backbone.history) {
					$(".back").on("click", function () {
						window.history.back();
						return false;
					});

					/* jshint nonew: false */
					new Marionette.AppRouter({
						appRoutes: {
							"": "initRoute"
							, ":mod(/)": "initRoute"
							, ":mod/:id(/)": "initRoute"
						}
						, controller: {
							initRoute: function (name) {
								require(["apps/" + (name ? name : "home") + "/App"], function (App) {
									App.start();
								});
							}
						}
					});

					Backbone.history.start();
				}
			}

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
		}
		, toggleLoading: function (action) {
			var $this = $(this)
				, theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme
				, msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text
				, textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible
				, textonly = !!$this.jqmData("textonly")
				, html = $this.jqmData("html") || "";
			$.mobile.loading(action, {
				text: msgText,
				textVisible: textVisible,
				theme: theme,
				textonly: textonly,
				html: html
			});
		}
	});

	var Common = _appManager.module("Common");
	Common.Module = Marionette.Module.extend({
		startWithParent: false
	});

	function _isDeviceOnline() {
		return navigator.connection
			&& (navigator.connection.type === Connection.WIFI
			|| navigator.connection.type === Connection.CELL_2G
			|| navigator.connection.type === Connection.CELL_3G
			|| navigator.connection.type === Connection.CELL_4G
			|| navigator.connection.type === Connection.CELL
			|| navigator.connection.type === Connection.ETHERNET
			|| navigator.connection.type === Connection.UNKNOWN);
	}
	if (window.isDEV) window.AppManager = _appManager;
	return _appManager;
});