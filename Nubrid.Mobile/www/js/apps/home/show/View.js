/*
Home Show View
*/
define(
["apps/AppManager"
, "text!apps/home/show/Show.html"]
, function (AppManager, ShowTemplate) {
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
		, handleOpenBrowserClick: function (event) {
			this.props.view.trigger("home:openBrowser", $(this.refs.txtInput.getDOMNode()).val());
		}
		, handleLoginClick: function (event) {
			var el = $(event.target);

			if (el.closest("a").length) this.props.view.trigger("home:login", event);
		}
		, componentDidMount: function () {
			$(this.refs.btnOpenBrowser.getDOMNode()).on("click", null, this.handleOpenBrowserClick);
			$(this.refs.divLogin.getDOMNode()).on("click", null, this.handleLoginClick);
		}
		, render: function () {
			return React.createElement("div", { "data-role": "page", id: this.props.id }
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