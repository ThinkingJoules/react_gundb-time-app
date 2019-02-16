import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem, Input } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

import SummaryView from './SummaryView.jsx'
import DetailView from './DetailView.jsx'

class AdminPanel extends Component {
  constructor(props) {
    super(props);

    var d = new Date();
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
    var monday = new Date(d.setDate(diff));
    var year = moment(monday).year(); 

    this.state = { 
      entries: [], 
      options: [], 
      userNames: [], 
      userPubs: [], 
      week: '', 
      query: '', 
      employee: '', 
      year: year, 
      detailWeek: '', 
      queryYear: '', 
      queryWeek: '', 
      queryEmployee: '', 
      isDetail: false }
  }

  componentWillMount() {
  	var self = this;

    let user = this.props.user
    self.setState({username: user.is.alias});
    self.setState({user_pub: user.is.pub});
    user.get('server/pub').get('pub').once(pub => self.setState({server_pub:pub}))
    user.get('alias').once(name => (name) ? self.setState({name: name}) : self.setState({name: "null"}));

    var query = this.args();

    self.setState({query: query});

    var entries = this.state.entries;

    gun.user('4MY55r2t5n1VkWrlZegUGmg4RpLzYlLbZDBUcpHSEz4.RBjz2SfSqORl7uWUWjlv85gNoVkb6Q9O8hTHJqN6uVY').get('employees').get('pub').map().on(function(curPub) {
      gun.user(curPub).get('alias').once(function(alias) {
        gun.user(curPub).get(query).map().on(function(entry, id) {
          entry.user = alias;
          entry.userPub = curPub;
          let data = { id: id, data: entry}
          const merged = _.merge(data,entry);
          const index = _.findIndex(entries, (o)=>{ return o.id === id});
          if(index >= 0) {
            entries[index] = merged;
          } else {
            entries.push(merged);
          }

          var sorted = _.sortBy(entries, function(curEntry) {
            if(curEntry.checkInEdit) {
              return curEntry.validity_unix + curEntry.checkInEdit
            }
            else {
              return curEntry.validity_unix + curEntry.checkIn;
            }
          });

          var grouped = _.groupBy(sorted, function(curEntry) {
            return curEntry.user;
          });

          var tempForPubs = _.groupBy(sorted, function(curEntry) {
            return curEntry.userPub;
          });

          self.setState({userNames: Object.keys(grouped)});
          self.setState({userPubs: Object.keys(tempForPubs)});
          self.setState({entries: grouped});
        });
      });
    });

    var options = this.state.options;

    gun.user('4MY55r2t5n1VkWrlZegUGmg4RpLzYlLbZDBUcpHSEz4.RBjz2SfSqORl7uWUWjlv85gNoVkb6Q9O8hTHJqN6uVY').get('employees').get('pub').map().on(function(curPub) {
      gun.user(curPub).get('alias').once(function(alias) {
        var obj = {alias: alias, pub: curPub};

        options.push(obj);

        self.setState({options: options});
      });
    });
  }

  args(){
    var d = new Date();
  	var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  	var monday = new Date(d.setDate(diff));
  	var isoWeek = moment(monday).isoWeek();
  	var year = moment(monday).year();
  	return year + '/' + isoWeek;
  }

  handleChange(event){
     this.setState({
       [event.target.id]: event.target.value
     });
  }

  query(event) {
    event.preventDefault();
    const self = this;
    var user = this.props.user;
    var entries = [];
    var d = new Date();
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
    var monday = new Date(d.setDate(diff));
    var year = moment(monday).year();

    var query = year + '/' + this.state.week;

    self.setState({query: query});
    self.setState({userNames: []});
    self.setState({userPubs: []});
    self.setState({entries: entries});

    gun.user('4MY55r2t5n1VkWrlZegUGmg4RpLzYlLbZDBUcpHSEz4.RBjz2SfSqORl7uWUWjlv85gNoVkb6Q9O8hTHJqN6uVY').get('employees').get('pub').map().on(function(curPub) {
      gun.user(curPub).get('alias').once(function(alias) {
        gun.user(curPub).get(query).map().once(function(entry, id) {
          if(entry) {
            entry.user = alias;
            entry.userPub = curPub;
            let data = { id: id, data: entry}
            const merged = _.merge(data,entry);
            const index = _.findIndex(entries, (o)=>{ return o.id === id});
            if(index >= 0) {
              entries[index] = merged;
            } else {
              entries.push(merged);
            }

              var sorted = _.sortBy(entries, function(curEntry) {
                if(curEntry.checkInEdit) {
                  return curEntry.validity_unix + curEntry.checkInEdit
                }
                else {
                  return curEntry.validity_unix + curEntry.checkIn;
                }
              });

              var grouped = _.groupBy(sorted, function(curEntry) {
                return curEntry.user;
              });

              var tempForPubs = _.groupBy(sorted, function(curEntry) {
                return curEntry.userPub;
              });

              self.setState({userNames: Object.keys(grouped)});
              self.setState({userPubs: Object.keys(tempForPubs)});
              self.setState({entries: grouped});
            
          }
        });
      });
    });

    self.setState({isDetail: false});
  }

  detailQuery(event) {
    event.preventDefault();
    this.setState({queryEmployee: this.state.employee, queryYear: this.state.year, queryWeek: this.state.detailWeek, isDetail: true});
  }

  buttonClick(entryId){
    const self = this;
    var user = this.props.user;
    var query = 'timeentry/' + entryId;   
    user.get(query).once(function(entry) {
      if(entry) {
        if(entry.checkInEdit) {
          if(entry.checkOutEdit) {
            var startDate = moment.unix(entry.validity_unix + entry.checkInEdit);
            var endTime = moment.unix(entry.validity_unix + entry.checkOutEdit).format('HH:mm');
            self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query});
            self.toggleModal();
          }
          else {
            var startDate = moment.unix(entry.validity_unix + entry.checkInEdit);
            var endTime = moment.unix(entry.validity_unix + entry.checkOut).format('HH:mm');
            self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query});
            self.toggleModal();
          }
        }
        else {
          if(entry.checkOutEdit) {
            var startDate = moment.unix(entry.validity_unix + entry.checkIn);
            var endTime = moment.unix(entry.validity_unix + entry.checkOutEdit).format('HH:mm');
            self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query});
            self.toggleModal();
          }
          else {
            var startDate = moment.unix(entry.validity_unix + entry.checkIn);
            var endTime = moment.unix(entry.validity_unix + entry.checkOut).format('HH:mm');
            self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query});
            self.toggleModal();
          }
        }
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
        <Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created)}} className="list-group-item list-group-item-action">
            {entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay} (Edited)
          </Button>
      )
    }
    else {
      return (
        <Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created)}} className="list-group-item list-group-item-action">
            {entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay}
          </Button>
      )
    }
  }

  render() {
    return (
      <div className="text-center">
      	<h1>Admin Panel</h1>
          <Form inline>
            <FormGroup controlId="week">
              <ControlLabel>ISO Week</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.week}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
            <Button onClick={this.query.bind(this)} type="submit">Search</Button>
          </Form>
          <br />
          <Form inline>
            <FormGroup controlId="employee">
              <ControlLabel>Employee</ControlLabel>
              <FormControl componentClass="select" placeholder="select" onChange={this.handleChange.bind(this)} >
                {this.state.options.length ? this.state.options.map((opt) => 
                  <option key={opt.alias} value={opt.pub}>{opt.alias}</option>
                ) : <option value="null">None</option>}
              </FormControl>
            </FormGroup>{' '}
            <FormGroup controlId="year">
              <ControlLabel>Year</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.year}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
            <FormGroup controlId="detailWeek">
              <ControlLabel>Week</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.detailWeek}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
            <Button onClick={this.detailQuery.bind(this)} type="submit">Search</Button>
          </Form>
          {(!this.state.isDetail) 
          ? <SummaryView 
              user={this.props.user} 
              entries={this.state.entries} 
              userNames={this.state.userNames} 
              query={this.state.query} 
            /> 
          : <DetailView user={this.props.user} userPub={this.state.queryEmployee} year={this.state.queryYear} week={this.state.queryWeek} /> }
      </div>
    );
  }
}

export default AdminPanel;
