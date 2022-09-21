/*
Common View
*/
define(
["apps/AppManager"]
, function (AppManager) {
	"use strict";
	var View = {};

	View.Layout = Marionette.LayoutView.extend({
		el: "body"
		, regions: {
			PanelRegion: "#PanelRegion"
			, HeaderRegion: "#HeaderRegion"
			, MainRegion: "#MainRegion"
			, FooterRegion: "#FooterRegion"
		}
		, initialize: function (options) {
			var Header = options.header ? options.header : View.Header;
			if (!(this.HeaderRegion.currentView instanceof Header)) {
				this.HeaderRegion.show(new Header({ region: this.HeaderRegion, title: options.title }));
			}
			else {
				this.HeaderRegion.currentView.title = options.title;
				this.HeaderRegion.currentView.render();
			}
			if (options.footer) {
				var Footer = options.footer;
				if (!(this.FooterRegion.currentView instanceof Footer)) {
					this.FooterRegion.show(new Footer());
					this.FooterRegion.$el.parent().toolbar();
				}
			}

			var Main = options.main;
			if (!(this.MainRegion.currentView instanceof Main)) this.MainRegion.show(new Main(_.extend(options, { region: this.MainRegion })));

			this.PanelRegion.$el.panel();
			$.mobile.resetActivePageHeight();

			return this;
		}
	});

	View.Header = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
			this.title = options.title;
		}
		, render: function () {
			this.view = ReactDOM.render(React.createElement(Header, this), this.parentEl);
			this.el = this.view.el;
			this.setElement(this.el);
		}
	});

	var Header = React.createClass({
		displayName: "Header"
		, mixins: [AppManager.BackboneMixin]
		, componentDidMount: function () {
			this.$el.toolbar();
		}
		, render: function () {
			return React.createElement("div", { "data-role": "header", "data-position": "fixed", "data-theme": "a" }
				, React.createElement("h1", null, this.props.title)
				, React.createElement("div", null
					, React.createElement("a", { href: "#PanelRegion", "data-icon": "bars", "data-iconpos": "notext", className: "ui-btn-left", "data-role": "button" }, "Panel")
					, React.createElement("a", { href: "#home", "data-icon": "home", "data-iconpos": "notext", className: "ui-btn-right", "data-role": "button" }, "Home")
				)
			);
		}
	});

	View.Content = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
		}
		, render: function () {
			this.page = ReactDOM.render(React.createElement(this.ReactClass, { id: this.id, view: this }), this.parentEl);
			this.el = ReactDOM.findDOMNode(this.page); // HACK: Avoid conflict with Marionette region show and react render.

			return this;
		}
	});

	return View;
});