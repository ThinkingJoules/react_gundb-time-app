import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange(event){
     this.setState({
       [event.target.id]: event.target.value
     });
   }

  login(event){
    event.preventDefault();

    const onUpdate = this.props.onUpdate;
    const state = this.state;
    const gunUser = this.props.user;
    this.props.user.auth(this.state.username, this.state.password, function(ack){
      if (ack.err){
        toastr['error'](ack.err);
        console.log(ack.err);
      }
      else{
        toastr['success']('Successfully logged in');
        $.post('/serverpub', function(res) {
          gunUser.get('server/pub').put({pub: res});
        });
        gunUser.get('alias').put(gunUser.is.alias);
        onUpdate(true);
      }
    });
   }

  signup(event){
    event.preventDefault();
    var gunUser = this.props.user;
    const onUpdate = this.props.onUpdate;
    const state = this.state;

    gunUser.create(state.username, state.password, function(ack){
      if (ack.err) {
        console.log(ack.err);
        toastr['error'](ack.err + ', attempting to login.')
        gunUser.auth(state.username, state.password, function(ack){
          if (ack.err) {
            console.log(ack.err);
            toastr['error'](ack.err);
          }
          else{
            toastr['success']('Successfully logged in');
            onUpdate(true);
          }
        });
      }
      else{
        toastr['success']('User created, attempting to login');
        gunUser.auth(state.username, state.password, function(ack){
          if (ack.err){
            console.log(ack.err)
            toastr['error'](ack.err);
          }
          else{
            toastr['success']('Successfully logged in');
            $.post('/createuser', {pub: gunUser.is.pub});
            $.post('/serverpub', function(res) {
              gunUser.get('server/pub').put({pub: res});
            });
            gunUser.get('alias').put(gunUser.is.alias);
            onUpdate(true);
          }
        });
      }
    });
   }

  render() {
    return (
      <Form inline>
        <FormGroup controlId="username">
          <ControlLabel>Username</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.username}
            onChange={this.handleChange.bind(this)}
            placeholder="Jane Doe"
          />
        </FormGroup>{' '}
        <FormGroup controlId="password">
          <ControlLabel>Password</ControlLabel>{' '}
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.handleChange.bind(this)}
           />
        </FormGroup>{' '}
        <Button onClick={this.login.bind(this)} type="submit">Signin</Button>
        <Button onClick={this.signup.bind(this)} type="submit">Signup</Button>
      </Form>

    );
  }
}
