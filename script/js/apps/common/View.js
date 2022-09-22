/*
Common View
*/
import _ from "lodash";

// TODO: import UI from "./UI";
import A from "apps/common/ui/A";
// TODO: Specify another UI for Phonegap
// TODO: const _view = {};

export class Layout { // TODO: _view.Layout = Marionette.LayoutView.extend( {
	// TODO: el: "body",
	// regions: {
	// 	PanelRegion: "#PanelRegion",
	// 	PopupRegion: "#PopupRegion",
	// 	HeaderRegion: "#HeaderRegion",
	// 	MainRegion: "#MainRegion",
	// 	FooterRegion: "#FooterRegion",
	// },
	constructor( options ) { // TODO: initialize( options ) {
		const _Header = options.Header; // TODO: || _view.Header;
		if ( !( this.HeaderRegion.currentView instanceof _Header ) ) {
			this.HeaderRegion.show( new _Header( { region: this.HeaderRegion, title: options.title } ) );
		}
		else {
			this.HeaderRegion.currentView.title = options.title;
			this.HeaderRegion.currentView.render();
		}
		if ( options.Footer ) {
			const Footer = options.Footer;
			if ( !( this.FooterRegion.currentView instanceof Footer ) ) {
				this.FooterRegion.show( new Footer() );
				this.FooterRegion.$el.parent().toolbar();
			}
		}

		const Main = options.Main;
		if ( !( this.MainRegion.currentView instanceof Main ) ) this.MainRegion.show( new Main( _.defaults( _.pick( options, [ "id", "title", "dispatcher" ] ), { region: this.MainRegion } ) ) );

		this.PanelRegion.$el.panel();
		this.PopupRegion.$el.popup();
		// TODO: $.mobile.resetActivePageHeight();

		return this;
	}// TODO: ,
}// TODO: );

export class Header extends React.Component { // TODO: const Header = React.createClass( {
	// TODO: displayName: "Header",
	// mixins: [ ReactPureRenderMixin ],
	// constructor( props ) {
	// 	super( props );
	// 	this.shouldComponentUpdate = ReactPureRenderMixin.shouldComponentUpdate.bind( this );
	// }
	// shouldComponentUpdate = ReactPureRenderMixin.shouldComponentUpdate;
	static propTypes = {
		title: React.PropTypes.string,
	}

	componentDidMount() {
		// TODO: $( ReactDOM.findDOMNode( this ) ).toolbar();
	}// TODO: ,

	render() {
		return (
			<div data-role="header" data-position="fixed" data-theme="a">
				<h1>{ this.props.title }</h1>
				<div>
					<A href="#PanelRegion" icon="bars" notext={ true } align="left">Panel</A>
					<A href="#home" icon="home" notext={ true } align="right">Home</A></div></div>
		);
	}// TODO: ,
}// TODO: );

// TODO: _view.Header = Marionette.ItemView.extend( {
// 	initialize( options ) {
// 		this.parentEl = options.region ? options.region.$el[ 0 ] : this.el;
// 		this.title = options.title;
// 	},
// 	render() {
// 		this.view = ReactDOM.render( <Header title={ this.title } />, this.parentEl );
// 		this.el = this.view.el;
// 		this.setElement( this.el );
// 	},
// } );

// _view.Content = Marionette.ItemView.extend( {
// 	render() {
// 		this.page = ReactDOM.render( <this.ReactClass id={ this.id } view={ this } />, this.options.region ? this.options.region.$el[ 0 ] : this.el );
// 		this.el = ReactDOM.findDOMNode( this.page ); // HACK: Avoid conflict between Marionette region show and react render.

// 		return this;
// 	}
// } );

export class IFrame extends React.Component { // TODO: _view.IFrame = Marionette.ItemView.extend( {
	static propTypes = {
		height: React.PropTypes.number,
		region: React.PropTypes.object,
		src: React.PropTypes.string,
		width: React.PropTypes.number,
	}

	constructor( props ) { // TODO: initialize( options ) {
		super( props );
		this.parentEl = props.region ? props.region.$el[ 0 ] : this.el;
		this.src = props.src;
		this.width = props.width;
		this.height = props.height;
		this.seamless = "";
	}// TODO: ,
	render() {
		this.view = ReactDOM.render( <iframe { ...this } />, this.parentEl );
		this.el = this.view.el;
		this.setElement( this.el );

		return null;
	}// TODO: ,
}// TODO: );

// TODO: _view.UI = UI;

// export default _view;