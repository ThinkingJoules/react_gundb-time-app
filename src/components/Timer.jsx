import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = { task: "", project: "", currentTimer: "00:00:00", intervalId: "" }
  }

  componentDidMount() {
    var intervalId = setInterval(this.getTimer.bind(this), 1000)
    this.setState({intervalId: intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  checkIn() {
    var gunUser = this.props.user;
    const self = this;

    var now = new Date();
    var timeEntryObj = {};

    var entryString = moment(now).year() + '/' + moment(now).isoWeek() +  '/' + moment(now).isoWeekday();
    var weekString = moment(now).year() + '/' + moment(now).isoWeek();
    var year = moment(now).year().toString();
    var startOfDay = moment(now).startOf('day').unix();

    timeEntryObj.created = moment(now).unix();
    timeEntryObj.created_day = entryString;
    timeEntryObj.validity = entryString;
    timeEntryObj.validity_unix = startOfDay;
    timeEntryObj.project = this.state.project;
    timeEntryObj.task = this.state.task;
    timeEntryObj.checkIn = moment(now).unix() - startOfDay;
    timeEntryObj.checkInLastModified = moment(now).unix();
    timeEntryObj.checkInDisplay = moment.unix(startOfDay + timeEntryObj.checkIn).format('MM/DD/YYYY, hh:mm A');
    timeEntryObj.lastModified = moment(now).unix();
    timeEntryObj.deleted = false;

    console.log(timeEntryObj);

    var getString = 'timeentry/' + timeEntryObj.created;

     gunUser.get('status').get('clocked-in').once(function(status) {
      if(status) {
        toastr['error']('Already clocked in');
      }
      else {
        gunUser.get(getString).put(timeEntryObj, function(ack) {
          if(ack.err) {
            console.log(ack.err);
            toastr['error'](ack.err);
          }
          else {
            toastr['success']('Time entry started');
            const timeEntry = gunUser.get(getString);
            gunUser.get(year).set(timeEntry);
            gunUser.get(weekString).set(timeEntry);
            gunUser.get(entryString).set(timeEntry);

            gunUser.get('status').get('current-time-entry').put(timeEntryObj.created);
            gunUser.get('status').get('clocked-in').put(true);
          }
        });
      }
    });
  }

  checkOut() {
    var gunUser = this.props.user;
    const self = this;

    var now = new Date();
    var startOfDay = moment(now).startOf('day').unix();
    var checkOut = moment(now).unix() - startOfDay;

    gunUser.get('status').get('current-time-entry').once(function(created) {
      if(created == 'null') {
        toastr['error']('No current time entry');
      }
      else {
        var getString = 'timeentry/' + created;
        gunUser.get(getString).get('checkOut').put(checkOut);
        gunUser.get(getString).get('checkOutLastModified').put(moment(now).unix());
        gunUser.get(getString).get('checkOutDisplay').put(moment.unix(startOfDay + checkOut).format('MM/DD/YYYY, hh:mm A'));
        gunUser.get(getString).get('lastModified').put(moment(now).unix());
        gunUser.get('status').get('current-time-entry').put('null');
        gunUser.get('status').get('clocked-in').put(false);
        gunUser.get(getString).once(function(entry) {
          if(entry) {
            if(entry.checkInEdit) {
              var duration = (checkOut - entry.checkInEdit)/3600;
              gunUser.get(getString).get('duration').put(duration);
            }
            else {
              var duration = (checkOut - created)/3600;
              gunUser.get(getString).get('duration').put(duration);
            }
          }
        });
        self.setState({currentTimer: '00:00:00'})
        self.setState({task: ''})
        self.setState({project: ''})
        //toastr['success']('Time entry clocked out');
      }
    });
  }

  getTimer() {
    var gunUser = this.props.user;
    const self = this;
    var now = new Date();

    gunUser.get('status').get('current-time-entry').once(function(created) {
      if(created == 'null') {
      }
      else {
        var getString = 'timeentry/' + created;
        gunUser.get(getString).once(function(entry) {
          if(entry) {
            if(entry.checkInEdit) {
              var checkInUnix = entry.checkInEdit + entry.validity_unix;
              var diff = moment(now).unix() - checkInUnix;
              var hours = Math.floor(diff / 3600);
              var minutes = Math.floor((diff - (hours * 3600)) / 60);
              var seconds = diff - (hours * 3600) - (minutes * 60);

              if(hours < 10) { hours = "0" + hours }
              if(minutes < 10) { minutes = "0" + minutes }
              if(seconds < 10) { seconds = "0" + seconds }

              var currentTimer = hours + ':' + minutes + ':' + seconds;

              self.setState({currentTimer: currentTimer});
              self.setState({task: entry.task});
              self.setState({project: entry.project});
            }
            else {
              var checkInUnix = entry.checkIn + entry.validity_unix;
              var diff = moment(now).unix() - checkInUnix;
              var hours = Math.floor(diff / 3600);
              var minutes = Math.floor((diff - (hours * 3600)) / 60);
              var seconds = diff - (hours * 3600) - (minutes * 60);

              if(hours < 10) { hours = "0" + hours }
              if(minutes < 10) { minutes = "0" + minutes }
              if(seconds < 10) { seconds = "0" + seconds }

              var currentTimer = hours + ':' + minutes + ':' + seconds;

              self.setState({currentTimer: currentTimer});
              self.setState({task: entry.task});
              self.setState({project: entry.project});
            }
          }
        });
      }
    });
  }

  handleChange(event){
     this.setState({
       [event.target.id]: event.target.value
     });
  }

  render() {
    return (
      <div className="fixed-top border border-primary">
        <Navbar>
          Task: <input type="text" id="task" value={this.state.task} onChange={this.handleChange.bind(this)} />
          Project: <input type="text" id="project" value={this.state.project} onChange={this.handleChange.bind(this)} />
          <Button id="timer-in" onClick={this.checkIn.bind(this)}>Check In</Button>
          <Button id="timer-out" onClick={this.checkOut.bind(this)}>Check Out</Button>
          <div id="current-timer" className="pull-right">{this.state.currentTimer}</div>
        </Navbar>
      </div>
    )
  }

}

export default Timer;