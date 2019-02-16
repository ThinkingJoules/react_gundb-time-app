"use strict";

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = { username: '', user_pub: '', server_pub: '', name: '' }
  }

  componentWillMount() {
    var self = this;

    let user = this.props.user
    self.setState({username: user.is.alias});
    self.setState({user_pub: user.is.pub});
    user.get('server/pub').get('pub').once(pub => self.setState({server_pub:pub}))
    user.get('alias').once(name => (name) ? self.setState({name: name}) : self.setState({name: "null"}));
  }

  render() {
    return (
        <div>
          <ul>
            <li>UserName: {this.state.username.toString()}</li>
            <li>Name: {this.state.name.toString()}</li>
            <li>UID: {this.state.user_pub.toString()}</li>
            <li>Server UID: {this.state.server_pub.toString()}</li>
          </ul>
        </div>
    );
  }
}
