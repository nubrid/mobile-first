import Apps from "apps";

const app = ( state, action ) => {
	switch ( action.type ) {
		case "SET_APP":
			return {
				App: action.App,
				name: action.name,
			};
		default:
			return state || {};
	}
};

const todo = ( state, action ) => {
	switch ( action.type ) {
		case "ADD_TODO":
			return {
				id: action.id,
				text: action.text,
				completed: false,
			};
		case "TOGGLE_TODO":
			return state.id === action.id
				? {
					...state,
					completed: !state.completed,
				}
				: state;
		default:
			return state;
	}
};

const todos = ( state, action ) => {
	switch ( action.type ) {
		case "ADD_TODO":
			return [
				...state,
				todo( undefined, action ),
			];
		case "TOGGLE_TODO":
			return Array.from( state, t => todo( t, action ) );
		default:
			return state || [];
	}
};

const todoMode = ( state, action ) => {
	switch ( action.type ) {
		case "SET_TODO_MODE":
			return action.mode;
		default:
			return state || "CREATE_MODE";
	}
};

// const todoApp = ( state, action ) =>
// 	state
// 		? {
// 			todos: todos( state.todos, action ),
// 			todoMode: todoMode( state.mode, action ),
// 		}
// 		: {};
const todoApp = Redux.combineReducers( {
	app,
	todos,
	todoMode,
});

ReactDOM.render(
	<Apps store={ Redux.createStore( todoApp ) } />,
	document.getElementById( "main" ),
);