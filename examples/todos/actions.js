import app from "./application";
import {
  ADD,
  EDIT,
  SAVE,
  DELETE,
  SET_DONE,
  SET_UNDONE,
  DELETE_ALL_DONE,
  CLEAR_INPUT_STATUS
} from "./messages";
import { bind } from "../../dist-node/utils";

const action = bind(app.bindAction, app);

export const addTodo = action(
  (todoText) => ({type: ADD, text: todoText})
);

export const editTodo = action(
  (todoId) => ({type: EDIT, id: todoId})
);

export const saveTodo = action(
  (todoText) => ({type: SAVE, text: todoText})
);

export const setDone = action(
  (todoId) => ({type: SET_DONE, id: todoId})
);

export const setUndone = action(
  (todoId) => ({type: SET_UNDONE, id: todoId})
);

export const deleteTodo = action(
  (todoId) => ({type: DELETE, id: todoId})
);

export const deleteAllDone = action(
  () => ({type: DELETE_ALL_DONE})
);

export const clearInputStatus = action(
  () => ({type: CLEAR_INPUT_STATUS})
);

export default exports;
