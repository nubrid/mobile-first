define(["backbone.marionette", "react", "react.dom", "backbone.react"], function (Marionette, React, ReactDOM) {
	"use strict";
	window.React = React;
	window.ReactDOM = ReactDOM;

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
		, Transition: {
			ListItem: { transitionName: "list-item", transitionEnterTimeout: 500, transitionLeaveTimeout: 500 }
			, Page: { transitionName: "page", transitionEnterTimeout: 0, transitionLeaveTimeout: 0, transitionAppear: true, transitionAppearTimeout: 1000 }
		}
		, changePage: function (options) {
			this.currentLayout = this.currentLayout && (this.currentLayout instanceof options.Layout)
				? this.currentLayout.initialize(options)
				: new options.Layout(options);
			$.mobile.initializePage();

			// TODO: Using React Animation
			//this.currentLayout.MainRegion.$el.pagecontainer("change", $(this.currentLayout.MainRegion.currentView.el), { reverse: options.reverse, transition: (options.transition || "slide"), allowSamePageTransition: true });
			if (options.id) _appManager.navigate(options.id);

			return this.currentLayout.MainRegion.currentView;
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

				if (window.isDEV && Modernizr.websockets) require([window.url.replace("//www", "//live") + "/livereload.js"]);
			}
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