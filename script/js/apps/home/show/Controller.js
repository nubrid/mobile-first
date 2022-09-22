/*
Home Show Controller
*/
export default ( id, callback ) => {
	const Controller = require( "apps/common/Controller" ).extend( {
		id
		, IFrame: require( "apps/common/View" ).IFrame
		, title: "Home"
		, Main: require( "./View" ).Content
		, show() {
			const page = AppManager.changePage( _.pick( this, "id", "title", "Main", "Layout" ) );

			page.on( "home:openBrowser", value => AppManager.net( () => AppManager.popup( { Popup: this.IFrame, src: value, width: 400, height: 300 } ) ) );

			page.on( "home:login", event => {
				let provider = $( event.target ).attr( "href" ).substring( 1 );

				AppManager.net( () => {
					const loginWindow = window.open( `${window.url}/auth/${provider}`, "_blank", "location=no" );

					loginWindow.addEventListener( "loadstop", event => {
						if ( event.url.indexOf( window.url ) === 0 ) {
							if ( event.url.indexOf( `${window.url}/#failed` ) === 0 ) {
								alert( "Login failed!" );
							}
							else if ( event.url.indexOf( `${window.url}/` ) === 0 ) {
								alert( "Login succeeded! See console for profile." );
							}

							loginWindow.close();
						}
					} );
				} );

				event.preventDefault();
				return false;
			} );

			AppManager.navigate( "home", { replace: true } );
		}
	} );

	callback( new Controller() );
};