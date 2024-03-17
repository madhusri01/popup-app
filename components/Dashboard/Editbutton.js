import React, { Component } from "react";
import EdiText from "react-editext";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSave = (val) => {
    console.log("Edited Value -> ", val);
  };

  render() {
    console.log("this.props.context", this.props.context);
    return (
      <EdiText
        type="text"
        value={`${this.props.context.title}  ${this.props.context.message}`}
        onSave={this.onSave}
      />
    );
  }
}
