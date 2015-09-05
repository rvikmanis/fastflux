import React from "react";

import Icon from "./Icon";
import TodoInput from "./TodoInput";

import actions from "../actions";
import app from "../application";

@app.subscribe("todos")
class TodoControls extends React.Component {

  state = {
    text: "",
    error: null
  };

  componentWillReceiveProps(props) {
    if(props.todos.success)
      this.setState({text: ""}, actions.clearInputStatus);

    else if (props.todos.emptyInputError)
      this.setState({error: "TODO text can't be empty"});

    else
      this.setState({error: null});
  }

  changeText(event) {
    this.setState({text: event.target.value});
    actions.clearInputStatus();
  }

  pressKey(event) {
    if(event.key === "Enter") {
      actions.addTodo(this.state.text);
    }
  }

  render() {
    return <div className="todo-controls">
      <TodoInput error={this.state.error}
                 placeholder="Today I want to..."
                 value={this.state.text}
                 onChange={this.changeText.bind(this)}
                 onKeyUp={this.pressKey.bind(this)}
                 onBlur={actions.clearInputStatus} />
      <div>
        <button disabled={this.props.doneCount === 0}
                type="button"
                className="todo-btn-clear-done"
                onClick={actions.deleteAllDone}>
          <Icon name="trash" /> <span>Remove done tasks</span>
        </button>
      </div>
    </div>
  }
}

export default TodoControls;