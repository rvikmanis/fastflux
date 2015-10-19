import Immutable from "immutable";
import {Application, Store, handler} from "../../index";
import MessageHistory from "../../plugins/MessageHistory";
import Messages from './messages';

const STATUS_SUCCESS = 1;
const STATUS_ERROR_EMPTY_INPUT = 2;

const Todo = Immutable.Record({text: "", done: false});

class TodoStore extends Store {

  items = Immutable.List();
  inputStatus = null;
  editing = null;

  mergeItem = (key, item) => this.items.set(
    key,
    this.items.get(key).merge(item)
  );

  getState = () => ({
    items: this.items.toJS(),
    doneCount: this.items.filter(todo => todo.get("done")).count(),
    success: this.inputStatus === STATUS_SUCCESS,
    emptyInputError: this.inputStatus === STATUS_ERROR_EMPTY_INPUT,
    editing: this.editing
  });

  @handler(Messages.ADD)
  addTodo(msg) {
    if(msg.text && msg.text.trim() !== "") {
      this.items = this.items.push(new Todo(msg));
      this.inputStatus = STATUS_SUCCESS;
    }
    else {
      this.inputStatus = STATUS_ERROR_EMPTY_INPUT;
    }
    this.emitChange();
  }

  @handler(Messages.EDIT)
  editTodo(msg) {
    this.editing = msg.id;
    this.emitChange();
  }

  @handler(Messages.SAVE)
  saveTodo(msg) {
    if(this.editing !== null) {
      if(msg.text && msg.text.trim() !== "") {
        this.items = this.mergeItem(this.editing, {text: msg.text});
      }
      this.editing = null;
      this.emitChange();
    }
  }

  @handler(Messages.CLEAR_INPUT_STATUS)
  clearInputStatus(msg) {
    this.inputStatus = null;
    this.emitChange();
  }

  @handler(Messages.SET_DONE)
  setDone(msg) {
    this.items = this.mergeItem(msg.id, {done: true});
    this.emitChange();
  }

  @handler(Messages.SET_UNDONE)
  setUndone(msg) {
    this.items = this.mergeItem(msg.id, {done: false});
    this.emitChange();
  }

  @handler(Messages.DELETE)
  deleteTodo(msg) {
    this.items = this.items.remove(msg.id);
    this.emitChange();
  }

  @handler(Messages.DELETE_ALL_DONE)
  deleteAllDone(msg) {
    this.items = this.items.filter(todo => !todo.get("done"));
    this.emitChange();
  }

}

const plugins = [
    MessageHistory.configure({log: true})
];

const stores = {
  todos: TodoStore
};

export default new Application(plugins, stores);
