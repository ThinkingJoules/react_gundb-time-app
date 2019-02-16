import React, { Component } from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";
import DatePicker from 'react-datetime'
import moment from 'moment';

import './datepicker.css'

export default class AddEntryModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      dateValue: "",
      endTime: "",
      task: "",
      project: ""
    };
  }

   componentWillReceiveProps(nextProps) {
    if(nextProps.dateValue != this.state.dateValue) {
      this.setState({dateValue: nextProps.dateValue});
    }
    if(nextProps.endTime != this.state.endTime) {
      this.setState({endTime: nextProps.endTime});
    }
    if(nextProps.task != this.state.task) {
      this.setState({task: nextProps.task});
    }
    if(nextProps.project != this.state.project) {
      this.setState({project: nextProps.project});
    }
  }

  handleChange(event){
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClose() {
    this.props.closeModal();
  }

  handleDateChange(event){
     this.setState({
       dateValue: event
     });
  }

  handleSubmit(event){
    event.preventDefault();
    var gunUser = this.props.user;
    const self = this;
    const stateDate = this.state.dateValue;
    var time = this.state.endTime.split(':');
    var now = new Date();
    var timeEntryObj = {};
    var entryString = moment(stateDate).year() + '/' + moment(stateDate).isoWeek() +  '/' + moment(stateDate).isoWeekday();
    var nowString = moment(now).year() + '/' + moment(now).isoWeek() +  '/' + moment(now).isoWeekday();
    var weekString = moment(stateDate).year() + '/' + moment(stateDate).isoWeek();
    var year = moment(stateDate).year().toString();
    var startOfDay = moment(stateDate).startOf('day').unix();

    timeEntryObj.created = moment(now).unix();
    timeEntryObj.created_day = nowString;
    timeEntryObj.validity = entryString;
    timeEntryObj.validity_unix = moment(stateDate).startOf('day').unix();
    timeEntryObj.project = this.state.project;
    timeEntryObj.task = this.state.task;
    timeEntryObj.checkInEdit = moment(stateDate).unix() - startOfDay;
    timeEntryObj.checkInLastModified = moment(now).unix();
    timeEntryObj.checkInDisplay = moment.unix(startOfDay + timeEntryObj.checkInEdit).format('MM/DD/YYYY, hh:mm A');
    timeEntryObj.checkOutEdit = moment(stateDate).set({h: time[0], m: time[1]}).unix() - startOfDay;
    timeEntryObj.checkOutLastModified = moment(now).unix();
    timeEntryObj.checkOutDisplay = moment.unix(startOfDay + timeEntryObj.checkOutEdit).format('MM/DD/YYYY, hh:mm A'),
    timeEntryObj.duration = (timeEntryObj.checkOutEdit - timeEntryObj.checkInEdit)/3600;
    timeEntryObj.lastModified = moment(now).unix();
    timeEntryObj.deleted = false;

    console.log(timeEntryObj);

    var getString = 'timeentry/' + timeEntryObj.created;

    gunUser.get(getString).put(timeEntryObj, function(ack) {
      if(ack.err) {
        console.log(ack.err);
        toastr['error'](ack.err);
      }
      else {
        toastr['success']('Time entry saved');
        const timeEntry = gunUser.get(getString);
        gunUser.get(year).set(timeEntry);
        gunUser.get(weekString).set(timeEntry);
        gunUser.get(entryString).set(timeEntry);
        self.props.closeModal();
      }
    });
  }

  render() {
    return (
      <Modal show={this.props.showStatus()} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Time Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form inline>
            <FormGroup controlId="datepicker">
              <ControlLabel>Start Time</ControlLabel>{' '}
              <DatePicker
                id="datepicker"
                input={false}
                value={this.state.dateValue}
                onChange={this.handleDateChange.bind(this)}
              />
            </FormGroup>{' '}
            <FormGroup controlId="endTime">
              <ControlLabel>End Time</ControlLabel>{' '}
              <FormControl
                id="endTime"
                type="time"
                value={this.state.endTime}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
            <FormGroup controlId="task">
              <ControlLabel>Task</ControlLabel>{' '}
              <FormControl
                id="task"
                type="text"
                value={this.state.task}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
            <FormGroup controlId="project">
              <ControlLabel>Project</ControlLabel>{' '}
              <FormControl
                id="project"
                type="text"
                value={this.state.project}
                onChange={this.handleChange.bind(this)}
               />
            </FormGroup>{' '}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose.bind(this)}>Close</Button>
          <Button className="btn-primary" onClick={this.handleSubmit.bind(this)} type="submit">Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}