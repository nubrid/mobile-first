/*
Home Show View
*/
define(
["apps/AppManager"
, "apps/common/View"]
, function (AppManager, CommonView) {
	"use strict";
	var Home = React.createClass({
		displayName: "Home"
		, mixins: [AppManager.BackboneMixin]
		, handleOpenBrowserClick: function () {
			this.props.view.trigger("home:openBrowser", $(this.refs.txtInput).val());
		}
		, handleLoginClick: function (event) {
			var el = $(event.target);

			if (el.closest("a").length) this.props.view.trigger("home:login", event);
		}
		, componentDidMount: function () {
			$(this.refs.btnOpenBrowser).on("click", this.handleOpenBrowserClick);
			$(this.refs.divLogin).on("click", this.handleLoginClick);
		}
		, render: function () {
			return React.createElement(React.addons.CSSTransitionGroup, AppManager.getTransition({ "data-role": "page", id: this.props.id, component: "div", className: "bounceInLeft" })
				, React.createElement("div", { role: "main", className: "ui-content" }
					, React.createElement("input", { type: "text", ref: "txtInput" })
					, React.createElement("input", { type: "button", ref: "btnOpenBrowser", value: "Open Browser" })
					, React.createElement("a", { href: "#todos", className: "ui-btn ui-input-btn ui-corner-all ui-shadow" }, "Todos")
					, React.createElement("a", { href: "#form", className: "ui-btn ui-input-btn ui-corner-all ui-shadow" }, "Form")
					, React.createElement("div", { ref: "divLogin", className: "social-media" }
						, React.createElement("a", { href: "#facebook", title: "facebook", className: "facebook" }, "Facebook")
						, React.createElement("a", { href: "#twitter", title: "twitter", className: "twitter" }, "Twitter")
						, React.createElement("a", { href: "#linkedin", title: "linkedin", className: "linkedin" }, "LinkedIn")
					)
				)
			);
		}
	});

	var Show = {};

	Show.Panel = CommonView.Content.extend({
		ReactClass: Home
	});

	return Show;
});