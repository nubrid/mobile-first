/*
Home Show View
*/
define(
["apps/AppManager"]
, function (AppManager) {
	"use strict";
	var Show = AppManager.module("HomeApp.Show");
	Show.Panel = Marionette.ItemView.extend({
		initialize: function (options) {
			this.parentEl = options.region ? options.region.$el[0] : this.el;
		}
		, render: function () {
			this.view = React.render(React.createElement(Home, { id: this.id, view: this }), this.parentEl);
			this.el = this.view.el; // HACK: Avoid conflict with Marionette region show and react render.
		}
	});

	var Home = React.createClass({
		displayName: "Home"
		, mixins: [AppManager.BackboneMixin]
		, handleOpenBrowserClick: function () {
			this.props.view.trigger("home:openBrowser", $(React.findDOMNode(this.refs.txtInput)).val());
		}
		, handleLoginClick: function (event) {
			var el = $(event.target);

			if (el.closest("a").length) this.props.view.trigger("home:login", event);
		}
		, componentDidMount: function () {
			$(React.findDOMNode(this.refs.btnOpenBrowser)).on("click", this.handleOpenBrowserClick);
			$(React.findDOMNode(this.refs.divLogin)).on("click", this.handleLoginClick);
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, { "data-role": "page", id: this.props.id, component: "div", transitionName: "page", transitionAppear: true, className: "bounceInLeft" }
				, React.createElement("div", { role: "main", className: "ui-content" }
					, React.createElement("input", { type: "text", ref: "txtInput" })
					, React.createElement("input", { type: "button", ref: "btnOpenBrowser", value: "Open Browser" })
					, React.createElement("a", { href: "#todos", className: "ui-btn ui-input-btn ui-corner-all ui-shadow" }, "Todos")
					, React.createElement("div", { ref: "divLogin", className: "social-media" }
						, React.createElement("a", { href: "#facebook", title: "facebook", className: "facebook" }, "Facebook")
						, React.createElement("a", { href: "#twitter", title: "twitter", className: "twitter" }, "Twitter")
						, React.createElement("a", { href: "#linkedin", title: "linkedin", className: "linkedin" }, "LinkedIn")
					)
				)
			);
		}
	});

	return Show;
});