import Immutable from "immutable";
import {Store} from "../../dist-node/index";
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

const STATUS_SUCCESS = 1;
const STATUS_ERROR_EMPTY_INPUT = 2;

const Todo = Immutable.Record({text: "", done: false});

const state = {

  items: Immutable.List(),
  inputStatus: null,
  editing: null,

  mergeItem(key, item) {
    return this.items.set(
      key,
      this.items.get(key).merge(item)
    );
  }
};

export default class TodoStore extends Store {
  getState() {
    return {
      items: state.items.toJS(),
      doneCount: state.items.filter(todo => todo.get("done")).count(),
      success: state.inputStatus === STATUS_SUCCESS,
      emptyInputError: state.inputStatus === STATUS_ERROR_EMPTY_INPUT,
      editing: state.editing
    }
  }

  static handlers = {

    [ADD](msg) {
      if(msg.text && msg.text.trim() !== "") {
        state.items = state.items.push(new Todo(msg));
        state.inputStatus = STATUS_SUCCESS;
      }
      else {
        state.inputStatus = STATUS_ERROR_EMPTY_INPUT;
      }
      this.emitChange();
    },

    [EDIT](msg) {
      state.editing = msg.id;
      this.emitChange();
    },

    [SAVE](msg) {
      if(state.editing !== null) {
        if(msg.text && msg.text.trim() !== "") {
          state.items = state.mergeItem(state.editing, {text: msg.text});
        }
        state.editing = null;
        this.emitChange();
      }
    },

    [CLEAR_INPUT_STATUS](msg) {
      state.inputStatus = null;
      this.emitChange();
    },

    [SET_DONE](msg) {
      state.items = state.mergeItem(msg.id, {done: true});
      this.emitChange();
    },

    [SET_UNDONE](msg) {
      state.items = state.mergeItem(msg.id, {done: false});
      this.emitChange();
    },

    [DELETE](msg) {
      state.items = state.items.remove(msg.id);
      this.emitChange();
    },

    [DELETE_ALL_DONE](msg) {
      state.items = state.items.filter(todo => !todo.get("done"));
      this.emitChange();
    }

  }

}
