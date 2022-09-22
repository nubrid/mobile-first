import uuid from "uuid";
import { ADD_TODO, EDIT_TODO, DELETE_TODO } from "../constants/actionTypes";

export const addTodo = todo => ({
  type: ADD_TODO,
  payload: { ...todo, id: uuid(), completed: false },
});

export const editTodo = todo => ({
  type: EDIT_TODO,
  payload: todo,
});

export const deleteTodo = ({ id }) => ({
  type: DELETE_TODO,
  payload: { id },
});
