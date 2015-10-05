import app from "./application";
import Messages from "./messages";

function text(type) {
  return text => ({type, text})
}

function id(type) {
  return id => ({type, id})
}

function type(type) {
  return () => ({type})
}

export default app.actions({

  addTodo: text(Messages.ADD),
  editTodo: id(Messages.EDIT),
  saveTodo: text(Messages.SAVE),
  setDone: id(Messages.SET_DONE),
  setUndone: id(Messages.SET_UNDONE),
  deleteTodo: id(Messages.DELETE),
  deleteAllDone: type(Messages.DELETE_ALL_DONE),
  clearInputStatus: type(Messages.CLEAR_INPUT_STATUS)
  
})
