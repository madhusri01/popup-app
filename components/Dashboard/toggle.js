import React, { Component } from "react";
import Switch from "react-switch";
import "./dashboard.css";

class SwitchExample extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(checked) {
    this.setState({ checked });
  }

  render() {
    return (
      <label>
        <Switch onChange={this.handleChange} checked={this.state.checked} />
        <div>Active Popup</div>
        {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
      </label>
    );
  }
}
export default SwitchExample;
