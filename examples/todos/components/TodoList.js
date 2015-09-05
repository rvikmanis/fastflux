import React from "react";
import TodoLine from "./TodoLine";
import app from "../application";

@app.subscribe("todos")
class TodoList extends React.Component {

  static defaultProps = {
    todos: {
      items: []
    }
  };

  render() {
    return <ul className="todo-list">
      {this.props.todos.items.map(
        (todo, key) => {
          let editing = (this.props.todos.editing === key);
          return <TodoLine key={key} id={key} editing={editing} {...todo} />
        }
      )}
    </ul>
  }

}

export default TodoList;
