import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

import EditEntryModal from './EditEntryModal.jsx'

const initialState = { entries: [], duration: 0, year: '', week: '', day: '', show: false, dateValue: "", endTime: "", task: "", project: "", queryString: "", showEnd: true }

class History extends Component {
  constructor(props) {
    super(props);

    this.state = initialState
  }
  componentDidMount() {
    this.resetState = this.resetState.bind(this);
    this.resetState();
  }
  resetState () {
    this.setState(initialState);
  }

  args(){
    if (this.state.year.length){
      if (this.state.week.length){
        if (this.state.day.length){
          return this.state.year + "/" + this.state.week + "/" + this.state.day
        }
        return this.state.year + "/" + this.state.week
      }
      return this.state.year
    }
    return
  }

  query(event) {
    event.preventDefault();
    const self = this;
    var user = this.props.user;
    var entries = this.state.entries;
    if(entries.length > 0) { entries = [] }
    var duration= this.state.duration;
    if(duration > 0) { duration = 0 }
    var query = this.args()

    this.setState({entries}, () => {
      if (query){
        user.get(query).map().on(function(entry, id) {
          let data = { id: id, data: entry}
          const merged = _.merge(data,entry);
          const index = _.findIndex(entries, (o)=>{ return o.id === id});
          if(index >= 0) {
            entries[index] = merged;
          } else {
            entries.push(merged);
            duration += entry.duration
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
          self.setState({duration});

        });
      } else{
        return
      }
    });
  }

  handleChange(event){
     this.setState({
       [event.target.id]: event.target.value
     });
  }

  buttonClick(entryId){
    const self = this;
    var user = this.props.user;
    var query = 'timeentry/' + entryId;   
    user.get(query).once(function(entry) {
      if(entry) {
        if(!entry.checkOut && !entry.checkOutEdit) {
          if(entry.checkInEdit) {
            var startDate = moment.unix(entry.validity_unix + entry.checkInEdit);
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: '', queryString: query, showEnd: false});
              self.toggleModal();
          }
          else {
            var startDate = moment.unix(entry.validity_unix + entry.checkIn);
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: '', queryString: query, showEnd: false});
              self.toggleModal();
          }
        }
        else {
          if(entry.checkInEdit) {
            if(entry.checkOutEdit) {
              var startDate = moment.unix(entry.validity_unix + entry.checkInEdit);
              var endTime = moment.unix(entry.validity_unix + entry.checkOutEdit).format('HH:mm');
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query, showEnd: true});
              self.toggleModal();
            }
            else {
              var startDate = moment.unix(entry.validity_unix + entry.checkInEdit);
              var endTime = moment.unix(entry.validity_unix + entry.checkOut).format('HH:mm');
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query, showEnd: true});
              self.toggleModal();
            }
          }
          else {
            if(entry.checkOutEdit) {
              var startDate = moment.unix(entry.validity_unix + entry.checkIn);
              var endTime = moment.unix(entry.validity_unix + entry.checkOutEdit).format('HH:mm');
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query, showEnd: true});
              self.toggleModal();
            }
            else {
              var startDate = moment.unix(entry.validity_unix + entry.checkIn);
              var endTime = moment.unix(entry.validity_unix + entry.checkOut).format('HH:mm');
              self.setState({task: entry.task, project: entry.project, dateValue: startDate, endTime: endTime, queryString: query, showEnd: true});
              self.toggleModal();
            }
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
    return (
      <Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created)}} className="list-group-item list-group-item-action">
        {entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay}
      </Button>
    )
  }

  render() {
    return (
      <div className="text-center">
        <h1>History</h1>
        <h2>Total Duration: {this.state.duration}</h2>
        <Form inline>
          <FormGroup controlId="year">
            <ControlLabel>Year</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.year}
              placeholder="Required"
              onChange={this.handleChange.bind(this)}
             />
          </FormGroup>{' '}
          <FormGroup controlId="week">
            <ControlLabel>Week</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.week}
              placeholder="Optional, week of year (1-52)"
              onChange={this.handleChange.bind(this)}
             />
          </FormGroup>{' '}
          <FormGroup controlId="day">
            <ControlLabel>Day</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.day}
              placeholder="Optional, (1-7, Monday = 1)"
              onChange={this.handleChange.bind(this)}
             />
          </FormGroup>{' '}
          <Button onClick={this.query.bind(this)} type="submit">Search</Button>
        </Form>
        <ListGroup className="text-center">
          {this.state.entries.map(this.getEntryItem.bind(this))}
        </ListGroup>
        <EditEntryModal 
          show={this.state.show} 
          user={this.props.user}
          showStatus={this.showStatus.bind(this)} 
          closeModal={this.closeModal.bind(this)} 
          dateValue={this.state.dateValue} 
          endTime={this.state.endTime}
          task={this.state.task} 
          project={this.state.project} 
          queryString={this.state.queryString} 
          diffDuration={this.diffDuration.bind(this)}
          showEndTime={this.state.showEnd}
        />
      </div>
    );
  }
  showStatus () { return this.state.show }
  closeModal () { this.setState({show: false}) }
  diffDuration(diff) { this.setState({duration: this.state.duration + diff}) }
}

export default History;
