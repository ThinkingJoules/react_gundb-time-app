import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem, Input } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

import AdminViewModal from './AdminViewModal.jsx'

class SummaryView extends Component {
  constructor(props) {
    super(props);

    this.state = { show: false, modalEntry: '', alias: '', durations: {} }
  }

  
  componentDidUpdate(prevProps) {
    var self = this;

    if(!(_.isEqual(this.props.entries, prevProps.entries))) {
      self.props.userNames.forEach(function(name) {
        var duration = _.sumBy(self.props.entries[name], function(o) { 
          if(!o.duration) {
            if(o.checkInEdit) {
              if(o.checkOut || o.checkOutEdit) {
                if(o.checkOutEdit) {
                  return (o.checkOutEdit - o.checkInEdit)/3600
                }
                else {
                  return (o.checkOut - o.checkInEdit)/3600
                }
              }
              else {
                return 0
              }
            }
            else {
              if(o.checkOut || o.checkOutEdit) {
                if(o.checkOutEdit) {
                  return (o.checkOutEdit - o.checkIn)/3600
                }
                else {
                  return (o.checkOut - o.checkIn)/3600
                }
              }
              else {
                return 0
              }
            }
          }
          else { 
            return o.duration
          }
        });
        duration = duration.toFixed(2);
        var durations = self.state.durations;
        if(durations[name]) {
          durations[name] = duration;
          self.setState({durations: durations});
        }
        else {
          durations[name] = duration;
          self.setState({durations: durations});
        }
      });
    }
  }

  buttonClick(entryId, userPub){
    const self = this;
    var user = this.props.user;
    var query = 'timeentry/' + entryId; 
    gun.user(userPub).get('alias').once(function(alias) {
      if(alias) {
        self.setState({alias: alias});
      }
    });  
    gun.user(userPub).get(query).once(function(entry) {
      if(entry) {
        self.setState({modalEntry: entry});
        self.toggleModal();
      }
    });
  }

  toggleModal() {
    var show = !this.state.show;
    this.setState({show});
  }

  getEntryItem(entry) {
  	const curEntry = entry;
    if(curEntry.checkInEdit || curEntry.checkOutEdit) {
      return (
        <Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created, curEntry.userPub)}} className="list-group-item list-group-item-action">
            {entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay} (Edited)
          </Button>
      )
    }
    else {
      return (
        <Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created, curEntry.userPub)}} className="list-group-item list-group-item-action">
            {entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay}
          </Button>
      )
    }
  }

  render() {
    return (
      <div>
        <h2>{this.props.query} Employee Summary</h2>
        <ListGroup>
          {this.props.userNames.length ? this.props.userNames.map((name) => 
            <ListGroupItem key={name}>
              <h3>{name}: {this.state.durations[name] ? this.state.durations[name] : 'N/A'} hrs</h3>
              <ListGroup>
                {this.props.entries[name] ? this.props.entries[name].map(this.getEntryItem.bind(this)) : null}
              </ListGroup>
            </ListGroupItem>
          ) : null}
        </ListGroup>
        <AdminViewModal 
          show={this.state.show} 
          entry={this.state.modalEntry}
          alias={this.state.alias}
          showStatus={this.showStatus.bind(this)} 
          closeModal={this.closeModal.bind(this)} 
        />
      </div>
    );
  }
  showStatus () { return this.state.show }
  closeModal () { this.setState({show: false}) }
}

export default SummaryView;
