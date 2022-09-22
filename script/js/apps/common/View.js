/*
Common View
*/
define(
["apps/AppManager"
// TODO: Specify another UI for Phonegap
, "apps/common/" + (window.phonegap ? "UI" : "UI")]
, function (AppManager, UI) {
	"use strict";
	var View = {};

	View.Layout = Marionette.LayoutView.extend({
		el: "body"
		, regions: {
			PanelRegion: "#PanelRegion"
			, PopupRegion: "#PopupRegion"
			, HeaderRegion: "#HeaderRegion"
			, MainRegion: "#MainRegion"
			, FooterRegion: "#FooterRegion"
		}
		, initialize: function (options) {
			var Header = options.Header || View.Header;
			if (!(this.HeaderRegion.currentView instanceof Header)) {
				this.HeaderRegion.show(new Header({ region: this.HeaderRegion, title: options.title }));
			}
			else {
				this.HeaderRegion.currentView.title = options.title;
				this.HeaderRegion.currentView.render();
			}
			if (options.Footer) {
				var Footer = options.Footer;
				if (!(this.FooterRegion.currentView instanceof Footer)) {
					this.FooterRegion.show(new Footer());
					this.FooterRegion.$el.parent().toolbar();
				}
			}

			var Main = options.Main;
			if (!(this.MainRegion.currentView instanceof Main)) this.MainRegion.show(new Main(_.defaults(_.pick(options, "id", "title", "dispatcher"), { region: this.MainRegion })));

			this.PanelRegion.$el.panel();
			this.PopupRegion.$el.popup();
			$.mobile.resetActivePageHeight();

			return this;
		}
	});

	var Header = React.createClass({
		displayName: "Header"
		, componentDidMount: function () {
			$(ReactDOM.findDOMNode(this)).toolbar();
		}
		, render: function () {
			return React.createElement("div", { "data-role": "header", "data-position": "fixed", "data-theme": "a" }
				, React.createElement("h1", null, this.props.title)
				, React.createElement("div", null
					, UI.a({ href: "#PanelRegion", icon: "bars", notext: true, align: "left" }, "Panel")
					, UI.a({ href: "#home", icon: "home", notext: true, align: "right" }, "Home")
				)
			);
		}
	});

	View.Header = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
			this.title = options.title;
		}
		, render: function () {
			this.view = ReactDOM.render(React.createElement(Header, { title: this.title }), this.parentEl);
			this.el = this.view.el;
			this.setElement(this.el);
		}
	});

	View.Content = Marionette.ItemView.extend({
		render: function () {
			this.page = ReactDOM.render(React.createElement(this.ReactClass, { id: this.id, view: this }), this.options.region ? this.options.region.$el[0] : this.el);
			this.el = ReactDOM.findDOMNode(this.page); // HACK: Avoid conflict between Marionette region show and react render.

			return this;
		}
	});

	View.IFrame = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
			this.src = options.src;
			this.width = options.width;
			this.height = options.height;
			this.seamless = "";
		}
		, render: function () {
			this.view = ReactDOM.render(React.createElement("iframe", this), this.parentEl);
			this.el = this.view.el;
			this.setElement(this.el);
		}
	});

	View.UI = UI;

	return View;
});