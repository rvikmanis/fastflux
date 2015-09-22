import React from "react";
import actions from "../actions";
import Icon from "./Icon";

export default class TodoItem extends React.Component {

  state = {
    highlightEditButton: false
  };

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

  mouseOverText() {
    this.setState({highlightEditButton: true});
  }

  mouseOutText() {
    this.setState({highlightEditButton: false});
  }

  render() {

    let editBtnCls = "todo-btn-edit";
    if(this.state.highlightEditButton) {
      editBtnCls += " hover";
    }

    return <div className="todo-item">
      <button type="button" className="todo-btn-done" onClick={this.clickDone.bind(this)}>
        <Icon name="check" size="lg" />
      </button>

      <span className="todo-text"
            onMouseOver={this.mouseOverText.bind(this)}
            onMouseOut={this.mouseOutText.bind(this)}
            onClick={this.clickEdit.bind(this)}>
        {this.props.text}
      </span>

      <button type="button"
              className={editBtnCls}
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
