import _ from "lodash";
import A from "apps/common/ui/A";
import Button from "apps/common/ui/Button";
import Input from "apps/common/ui/Input";
import Page from "apps/common/ui/Page";
import ref from "apps/common/ui/ref";

const HomeView = ( { name }) => {
	const handleOpenBrowserClick = () => {
		const referrer = window.open( this.txtInput.value, "_blank", "location=no" );

		setTimeout( function() {
			referrer.close();
		}, 5000 );
	};

	const handleLoginClick = ( event ) => {
		const provider = event.target.hash.substring( 1 )
			, referrer = window.open( `${AppManager.url}/auth/${provider}`, "_blank", "location=no" );

		referrer.addEventListener( "loadstop", event => {
			if ( _.startsWith( event.url, AppManager.url ) ) {
				if ( _.startsWith( event.url, `${AppManager.url}/#failed` ) ) {
					alert( "Login failed!" );
				}
				else if ( _.startsWith( event.url, `${AppManager.url}/` ) ) {
					alert( "Login succeeded! See console for profile." );
				}

				referrer.close();
			}
		});

		event.preventDefault();
		return false;
	};

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
};
HomeView.propTypes = {
	name: React.PropTypes.string.isRequired,
};

export default HomeView;