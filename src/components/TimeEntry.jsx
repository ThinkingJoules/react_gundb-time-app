import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";

export default class TimeEntry extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    var self = this;

    let user = this.props.user
  }

  render() {
    return (
      <li>
        {this.props.entry.created_day}
      </li>
    );
  }
}
