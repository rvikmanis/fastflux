import React from "react";
import actions from "../actions";
import Icon from "./Icon";

export default class TodoItem extends React.Component {
  clickDone() {
    if(this.props.done) {
      actions.setUndone(this.props.id);
    }
    else {
      actions.setDone(this.props.id);
    }
  }

  clickDelete() {
    actions.deleteTodo(this.props.id);
  }

  clickEdit() {
    actions.editTodo(this.props.id);
  }

  render() {
    return <div className="todo-item">
      <button type="button" className="todo-btn-done" onClick={this.clickDone.bind(this)}>
        <Icon name="check" size="lg" />
      </button>

      <span className="todo-text">{this.props.text}</span>

      <button type="button"
              className="todo-btn-edit"
              onClick={this.clickEdit.bind(this)}>
        <Icon name="pencil" size="lg" />
      </button>

      <button type="button"
              className="todo-btn-delete"
              onClick={this.clickDelete.bind(this)}>
        <Icon name="trash" size="lg" />
      </button>
    </div>
  }
}
