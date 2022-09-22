import CommonApp from "apps/common/App";

const TodosApp = ( props ) => (
	<CommonApp { ...props } View={ require( "./View" ) } />
);

export default TodosApp;