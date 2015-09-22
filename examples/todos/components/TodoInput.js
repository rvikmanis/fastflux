import React from "react";

export default class TodoInput extends React.Component {
  componentDidMount() {
    if(this.props.autoFocus) {
      this.focus();
    }
  }

  focus() {
    React.findDOMNode(this.refs.input).focus();
  }

  render() {
    let inputClass = "todo-input-field";
    let error = null;

    if(this.props.error) {
      inputClass += " error";
      error = <p className="todo-input-error">{this.props.error}</p>;
    }

    return <div className="todo-input">
      <input type="text"
             ref="input"
             className={inputClass}
             placeholder={this.props.placeholder}
             value={this.props.value}
             onChange={this.props.onChange}
             onKeyUp={this.props.onKeyUp}
             onBlur={this.props.onBlur}
             onFocus={this.props.onFocus} />
      {error}
    </div>
  }
}
