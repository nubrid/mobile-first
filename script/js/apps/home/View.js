/*
Home View
*/
// TODO: import { Content, UI } from "apps/common/View";
import _ from "lodash";
import A from "apps/common/ui/A";
import Button from "apps/common/ui/Button";
import Input from "apps/common/ui/Input";
import Page from "apps/common/ui/Page";
import ref from "apps/common/ui/ref";

const HomeView = ( { name } ) => { // TODO: export default class Home extends React.Component { // TODO: const Home = React.createClass( {
	// TODO: displayName: "Home",
	// static propTypes = {
	// 	name: React.PropTypes.string.isRequired,
	// }

	const handleOpenBrowserClick = () => {
		// TODO: this.props.view.trigger( "home:openBrowser", $( this.txtInput ).val() );
		const referrer = window.open( this.txtInput.value, "_blank", "location=no" );

		setTimeout( function() {
			referrer.close();
		}, 5000 );
	};// TODO: ,

	const handleLoginClick = ( event ) => {
		// TODO: const el = $( event.target );

		// if ( el.closest( "a" ).length ) this.props.view.trigger( "home:login", event );
		const provider = event.target.hash.substring( 1 )
			, referrer = window.open( `${AppManager.url}/auth/${provider}`, "_blank", "location=no" );

		referrer.addEventListener( "loadstop", event => {
			if ( _.startsWith( event.url, AppManager.url ) ) { // TODO: if ( event.url.indexOf( AppManager.url ) === 0 ) {
				if ( _.startsWith( event.url, `${AppManager.url}/#failed` ) ) { // TODO: if ( event.url.indexOf( `${AppManager.url}/#failed` ) === 0 ) {
					alert( "Login failed!" );
				}
				else if ( _.startsWith( event.url, `${AppManager.url}/` ) ) { // TODO: else if ( event.url.indexOf( `${AppManager.url}/` ) === 0 ) {
					alert( "Login succeeded! See console for profile." );
				}

				referrer.close();
			}
		} );

		event.preventDefault();
		return false;
	};// TODO: ,

	// TODO: render() {
	return (
		<Page id={ name }>
			<Input _ref={ ref( "txtInput", this ) } />
			<Button onClick={ handleOpenBrowserClick }>Open Browser</Button>
			<div><A href="#todos">Todos</A></div>
			<div onClick={ handleLoginClick } className="social-media">
				<A href="#facebook" title="facebook" className="facebook">Facebook</A>
				<A href="#twitter" title="twitter" className="twitter">Twitter</A>
				<A href="#linkedin" title="linkedin" className="linkedin">LinkedIn</A></div></Page>
	);
	// TODO: },
};// TODO: );
HomeView.propTypes = {
	name: React.PropTypes.string.isRequired,
};

export default HomeView;

// const Show = {};

// Show.Content = Content.extend( {
// 	ReactClass: Home
// } );

// export default Show;