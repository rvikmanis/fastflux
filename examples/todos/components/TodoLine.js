import React from "react";

import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

import actions from "../actions";

export default class TodoLine extends React.Component {
  state = {text: null};

  changeText(event) {
    this.setState({text: event.target.value});
  }

  pressKey(event) {
    if(event.key === "Enter") {
      actions.saveTodo(this.state.text);
    }
  }

  blurInput() {
    actions.saveTodo(this.state.text);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.editing && !this.props.editing) {
      this.setState({text: nextProps.text});
    }
    else if(!nextProps.editing && this.props.editing) {
      this.setState({text: null});
    }
  }

  render() {
    const {id, text, done} = this.props;

    let itemClass = "todo-line";
    if(done) {
      itemClass += " done";
    }

    let content;
    if(this.props.editing) {
      content = <TodoInput value={this.state.text}
                           onChange={this.changeText.bind(this)}
                           onBlur={this.blurInput.bind(this)}
                           onKeyUp={this.pressKey.bind(this)}
                           autoFocus={true} />;
    }
    else {
      content = <TodoItem id={id} text={text} done={done} />;
    }

    return <li className={itemClass}>{content}</li>
  }
}
