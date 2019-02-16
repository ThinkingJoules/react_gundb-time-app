import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Gun from 'gun/gun';
import SEA from 'gun/sea'

import PrivateRoute from './PrivateRoute.jsx'

import NavBar from './NavBar.jsx'
import Home from './Home.jsx';
import Today from './Today.jsx'
import ThisWeek from './ThisWeek.jsx'
import History from './History.jsx'
import Profile from './Profile.jsx'
import LoginForm from './LoginForm.jsx'
import Timer from './Timer.jsx'
import Year from './Year.jsx'
import AdminPanel from './AdminPanel.jsx'

class App extends Component {
  constructor() {
  super();
    this.gun = Gun(location.origin+'/gun');
    window.gun = this.gun;
    this.user = this.gun.user();
    window.user = this.user;
    this.state = {
      loggedIn: false
    }
  }

  render() {
    return (
      <Router>
        <div>
          {this.state.loggedIn && <NavBar user={this.user} />}
          {this.state.loggedIn && <Timer user={this.user} />}
          {!this.state.loggedIn && <Route exact path="/"
            render={(props) => <Home {...props} user={this.user} onUpdate={this.onUpdate.bind(this)} />}
          />}
          <Route exact path="/login"
            render={(props) => <LoginForm {...props} user={this.user} onUpdate={this.onUpdate.bind(this)} />}
          />
          <Route path="/today" 
            render={(props) => <Today {...props} user={this.user} />}
          />
          <Route path="/thisweek"
            render={(props) => <ThisWeek {...props} user={this.user} />}
          />
          <Route path="/history"
            render={(props) => <History {...props} user={this.user} />}
          />
          <Route path="/profile"
            render={(props) => <Profile {...props} user={this.user} username={this.state.username} onUpdate={this.onUpdate.bind(this)} />}
          />
          <Route path="/admin"
            render={(props) => <AdminPanel {...props} user={this.user} />}
          />
        </div>
      </Router>
    );
  }
  onUpdate (loggedIn, username) { this.setState({loggedIn: loggedIn}) }
}

export default App;
