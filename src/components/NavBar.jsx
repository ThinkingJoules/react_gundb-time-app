import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import AddEntryModal from './AddEntryModal.jsx'

class NavBar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false
    };
  }

  toggleModal() {
    var show = !this.state.show;
    this.setState({show});
  }

  render() {
    return (
      <div>
        <Navbar id="topNav" fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Navbar.Link componentClass={Link} href="/today" to="/today">
               Time App
              </Navbar.Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} componentClass={Link} href="/" to="/history">
                History
              </NavItem>
              <NavItem eventKey={2} componentClass={Link} href="/" to="/thisweek">
                This Week
              </NavItem>
              <NavItem onClick={() => this.toggleModal()}>
                Add Entry
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} componentClass={Link} href="/" to="/today">
                Timer
              </NavItem>
              <NavItem eventKey={2} componentClass={Link} href="/" to="/profile">
                Profile
              </NavItem>
              {this.props.user.is.pub == "22AU-E3bcOkrtoTBM9C3DfH2GvId3RtGuw5R6iwnrdM.xsKtUxhmwcsSbizrMsqZZP26VvEdWmOYLJMWFYR2sOk" && 
                <NavItem eventKey={1} componentClass={Link} href="/" to="/admin">
                  Admin Panel
                </NavItem>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AddEntryModal show={this.state.show} user={this.props.user} showStatus={this.showStatus.bind(this)} closeModal={this.closeModal.bind(this)} dateValue="" endTime="" task="" project="" />
      </div>
    );
  }
  showStatus () { return this.state.show }
  closeModal () { this.setState({show: false}) }
}

export default NavBar;
