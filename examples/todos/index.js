import React from "react";
import TodoList from "./components/TodoList";
import TodoControls from "./components/TodoControls";

require("./styles/todos.scss");

class TodoView extends React.Component {
  render() {
    return <div className="todos">
      <TodoList />
      <TodoControls />
    </div>
  }
}

React.render(<TodoView />, document.getElementById("mount"));
