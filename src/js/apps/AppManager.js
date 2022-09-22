﻿define(["backbone.marionette", "react", "react.dom", "backbone.react"], function (Marionette, React, ReactDOM) {
	"use strict";
	window.React = React;
	window.ReactDOM = ReactDOM;
	window.protocol = window.phonegap
		? (window.isDEV ? "http:" : "https:")
		: document.location.protocol;
	window.host = "//" + (window.phonegap ? $("body").data("host") || document.location.host : document.location.host);

	// HACK: Force websocket if available.
	if (Modernizr.websockets) {
		var _merge = Primus.prototype.merge;
		Primus.prototype.merge = function () {
			var target = _merge.apply(this, arguments);

			return _.extend(target, {
				transports: [
					"websocket"
				]
			});
		};
	}

	// HACK: For compatibility of primus with backbone.iobind.
	var _emit = Primus.prototype.emit;
	var _sendMethods = [
	"*:create"
	, "*:delete"
	, "*:read"
	, "*:update"
	];
	Primus.prototype.emit = function () {
		var message = arguments[0];
		var delimiterIndex = message.lastIndexOf(":");
		var method = "*" + message.substring(delimiterIndex);
		if (arguments.length === 3 && _.indexOf(_sendMethods, method) !== -1) {
			var args = _.extend([], arguments);
			args.splice(0, 1, method);
			args.splice(2, 0, message.substring(0, delimiterIndex));
			Primus.prototype.send.apply(this, args);
		}
		else {
			_emit.apply(this, arguments);
		}
	};

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
		, Transition: {
			ListItem: { transitionName: "list-item", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }
			, Page: { transitionName: "page", transitionEnterTimeout: 0, transitionLeaveTimeout: 0, transitionAppear: true, transitionAppearTimeout: 1000 }
		}
		, changePage: function (options) {
			this.currentLayout = this.currentLayout && (this.currentLayout instanceof options.layout)
				? this.currentLayout.initialize(options)
				: new options.layout(options);
			$.mobile.initializePage();
			
			// HACK: Native slide
			if (window.phonegap) {
				var slideOptions = {
					// "direction": "left" // 'left|right|up|down', default 'left' (which is like 'next')
					// , "duration": 400 // in milliseconds (ms), default 400
					// "slowdownfactor": 4 // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
					// , "slidePixels": 0 // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
					"iosdelay": 100 // ms to wait for the iOS webview to update before animation kicks in, default 60
					, "androiddelay": 150 // same as above but for Android, default 70
					, "winphonedelay": 250 // same as above but for Windows Phone, default 200,
					, "fixedPixelsTop": 45 // the number of pixels of your fixed header, default 0 (iOS and Android)
					// , "fixedPixelsBottom": 0 // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
				};

				window.plugins.nativepagetransitions.slide(
					slideOptions
					// , function (msg) {console.log("success: " + msg);} // called when the animation has finished
					// , function (msg) {alert("error: " + msg);} // called in case you pass in weird values
				);
			}

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
					? _.extend(_appManager.Config.IO.Options, { strategy: false })
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
		, getTransition: function (options) {
			return options["data-role"] === "page" ? _.extend(options, this.Transition.Page) : options;
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
							, ":mod/:id(/)": "initRoute" // TODO: need to test!
						}
						, controller: {
							initRoute: function (name) {
								var appName = name || "home";
								require(["apps/" + appName + "/App"], function (App) {
									App.start(appName);
								});
							}
						}
					});

					Backbone.history.start();
				}
			}

			if (window.phonegap) {
				require(["cordova"], function () {
					$(function () {
						document.addEventListener("deviceready", start, false);
					});
				});
			}
			else {
				start();
			}

			if (!window.phonegap && window.isDEV && Modernizr.websockets) require([window.protocol + window.host.replace("//www", "//live") + "/livereload.js"]);
		}
		, popup: function (options) {
			var Popup = options.popup;
			var popupRegion = this.currentLayout.PopupRegion;
			if (!(popupRegion.currentView instanceof Popup)) {
				popupRegion.show(new Popup(_.extend(options, { region: popupRegion })));
			}
			else {
				popupRegion.currentView.src = options.src;
				popupRegion.currentView.width = options.width;
				popupRegion.currentView.height = options.height;
				popupRegion.currentView.render();
			}
			popupRegion.$el.popup("open");
		}
		, toggleLoading: function (action, $this) {
			if (!$this) $this = $(this);
			var theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme
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

	if (window.isDEV) window.AppManager = _appManager;
	return _appManager;
});