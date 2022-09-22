import CommonApp from "apps/common/App";

const HomeApp = ( props ) => (
	<CommonApp { ...props } View={ require( "./View" ) } />
);

export default HomeApp;