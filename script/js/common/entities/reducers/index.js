import { ADD_TODO, EDIT_TODO, DELETE_TODO } from "../constants/actionTypes";

const initialState = {
  todos: [],
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TODO:
      return { ...state, todos: [...state.todos, payload] };
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(// eslint-disable-line lodash/prefer-lodash-method
          todo => (todo.id === payload.id ? { ...todo, ...payload } : todo),
        ),
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(({ id }) => id !== payload.id),
      };
    default:
      return state;
  }
};

export default rootReducer;
