import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem, Input } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

import AdminViewModal from './AdminViewModal.jsx'

class DetailView extends Component {
  constructor(props) {
    super(props);

    this.state = { entries: [], duration: 0, show: false, alias: '', modalEntry: '' }
  }

  componentWillMount() {
    var self = this;
    var query = this.props.year + '/' + this.props.week;    
    var entries = this.state.entries;
    var duration = this.state.duration;

    gun.user(self.props.userPub).get('alias').once(function(alias) {
      self.setState({alias: alias});
      gun.user(self.props.userPub).get(query).map().on(function(entry, id) {
        entry.userPub = self.props.userPub;
        let data = { id: id, data: entry}
        const merged = _.merge(data,entry);
        const index = _.findIndex(entries, (o)=>{ return o.id === id});
        if(index >= 0) {
          entries[index] = merged;
        } else {
          entries.push(merged);
          if(entry.duration) {
            duration += entry.duration;
          }
          else {
            if(entry.checkInEdit) {
              if(entry.checkOut || entry.checkOutEdit) {
                if(entry.checkOutEdit) {
                  var temp = (entry.checkOutEdit - entry.checkInEdit)/3600
                  duration += temp
                }
                else {
                  var temp = (entry.checkOut - entry.checkInEdit)/3600
                  duration += temp
                }
              }
            }
            else {
              if(entry.checkOut || entry.checkOutEdit) {
                if(entry.checkOutEdit) {
                  var temp = (entry.checkOutEdit - entry.checkIn)/3600
                  duration += temp
                }
                else {
                  var temp = (entry.checkOut - entry.checkIn)/3600
                  duration += temp
                }
              }
            }
          }
        }

        var sorted = _.sortBy(entries, function(curEntry) {
          if(curEntry.checkInEdit) {
            return curEntry.validity_unix + curEntry.checkInEdit
          }
          else {
            return curEntry.validity_unix + curEntry.checkIn;
          }
        });

        self.setState({entries: sorted});
        self.setState({duration: duration});
      });
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.year != prevProps.year || this.props.week != prevProps.week || this.props.userPub != prevProps.userPub) {
      var self = this;
      var query = this.props.year + '/' + this.props.week;    
      var entries = [];
      var duration = 0;

      self.setState({entries: entries});
      self.setState({duration: duration});

      gun.user(self.props.userPub).get('alias').once(function(alias) {
        self.setState({alias: alias});
        gun.user(self.props.userPub).get(query).map().once(function(entry, id) {
          entry.userPub = self.props.userPub;
          let data = { id: id, data: entry}
          const merged = _.merge(data,entry);
          const index = _.findIndex(entries, (o)=>{ return o.id === id});
          if(index >= 0) {
            entries[index] = merged;
          } else {
            entries.push(merged);
            if(entry.duration) {
              duration += entry.duration;
            }
            else {
              if(entry.checkInEdit) {
                if(entry.checkOut || entry.checkOutEdit) {
                  if(entry.checkOutEdit) {
                    var temp = (entry.checkOutEdit - entry.checkInEdit)/3600
                    duration += temp
                  }
                  else {
                    var temp = (entry.checkOut - entry.checkInEdit)/3600
                    duration += temp
                  }
                }
              }
              else {
                if(entry.checkOut || entry.checkOutEdit) {
                  if(entry.checkOutEdit) {
                    var temp = (entry.checkOutEdit - entry.checkIn)/3600
                    duration += temp
                  }
                  else {
                    var temp = (entry.checkOut - entry.checkIn)/3600
                    duration += temp
                  }
                }
              }
            }
          }

          var sorted = _.sortBy(entries, function(curEntry) {
            if(curEntry.checkInEdit) {
              return curEntry.validity_unix + curEntry.checkInEdit
            }
            else {
              return curEntry.validity_unix + curEntry.checkIn;
            }
          });

          self.setState({entries: sorted});
          self.setState({duration: duration});
        });
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
        <h2>{this.props.year}/{this.props.week}: {this.state.alias}, {this.state.duration.toFixed(2)} hrs</h2>
        <ListGroup className="text-center">
          {this.state.entries.map(this.getEntryItem.bind(this))}
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

export default DetailView;
