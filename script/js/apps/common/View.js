/*
Common View
*/
import AppManager from "apps/AppManager";
import UI from "apps/common/UI";
// TODO: Specify another UI for Phonegap
let View = {};

View.Layout = Marionette.LayoutView.extend({
	el: "body"
	, regions: {
		PanelRegion: "#PanelRegion"
		, PopupRegion: "#PopupRegion"
		, HeaderRegion: "#HeaderRegion"
		, MainRegion: "#MainRegion"
		, FooterRegion: "#FooterRegion"
	}
	, initialize( options ) {
		let Header = options.Header || View.Header;
		if (!(this.HeaderRegion.currentView instanceof Header)) {
			this.HeaderRegion.show(new Header({ region: this.HeaderRegion, title: options.title }));
		}
		else {
			this.HeaderRegion.currentView.title = options.title;
			this.HeaderRegion.currentView.render();
		}
		if (options.Footer) {
			let Footer = options.Footer;
			if (!(this.FooterRegion.currentView instanceof Footer)) {
				this.FooterRegion.show(new Footer());
				this.FooterRegion.$el.parent().toolbar();
			}
		}

		let Main = options.Main;
		if (!(this.MainRegion.currentView instanceof Main)) this.MainRegion.show(new Main(_.defaults(_.pick(options, "id", "title", "dispatcher"), { region: this.MainRegion })));

		this.PanelRegion.$el.panel();
		this.PopupRegion.$el.popup();
		$.mobile.resetActivePageHeight();

		return this;
	}
});

let Header = React.createClass({ // jshint ignore:line
	displayName: "Header"
	, mixins: [AppManager.PureRenderMixin]
	, componentDidMount () {
		$(ReactDOM.findDOMNode(this)).toolbar();
	}
	, render () {
		/* jshint ignore:start */
		return (
			<div data-role="header" data-position="fixed" data-theme="a">
				<h1>{ this.props.title }</h1>
				<div>
					<UI.a href="#PanelRegion" icon="bars" notext={ true } align="left">Panel</UI.a>
					<UI.a href="#home" icon="home" notext={ true } align="right">Home</UI.a></div></div>
		);
		/* jshint ignore:end */
	}
});

View.Header = Marionette.ItemView.extend({
	initialize( options ) {
		this.parentEl = options.region ? options.region.$el[0] : this.el;
		this.title = options.title;
	}
	, render () {
		/* jshint ignore:start */
		this.view = ReactDOM.render(<Header title={ this.title } />, this.parentEl);
		/* jshint ignore:end */
		this.el = this.view.el;
		this.setElement(this.el);
	}
});

View.Content = Marionette.ItemView.extend({
	render () {
		/* jshint ignore:start */
		this.page = ReactDOM.render(<this.ReactClass id={ this.id } view={ this } />, this.options.region ? this.options.region.$el[0] : this.el);
		/* jshint ignore:end */
		this.el = ReactDOM.findDOMNode(this.page); // HACK: Avoid conflict between Marionette region show and react render.

		return this;
	}
});

View.IFrame = Marionette.ItemView.extend({
	initialize( options ) {
		this.parentEl = options.region ? options.region.$el[0] : this.el;
		this.src = options.src;
		this.width = options.width;
		this.height = options.height;
		this.seamless = "";
	}
	, render () {
		/* jshint ignore:start */
		this.view = ReactDOM.render(<iframe { ...this } />, this.parentEl);
		/* jshint ignore:end */
		this.el = this.view.el;
		this.setElement(this.el);
	}
});

View.UI = UI;

export default View;