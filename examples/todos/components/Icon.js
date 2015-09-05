import React from "react";

export default class Icon extends React.Component {
  render() {
    let iconClass = `fa fa-${this.props.name}`;
    let size = this.props.size;

    if(size) {
      iconClass += ` fa-${size}`;
    }

    return <i className={iconClass}></i>
  }
}
