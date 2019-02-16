import React, { Component } from 'react';
import LoginForm from './LoginForm.jsx'

export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm user={this.props.user} onUpdate={this.props.onUpdate} />
        <h3>How it works (Docs go here)</h3>

      </div>);
  }
};
