import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";

export default class Testing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getValue: "",
      getOutput: "",
      putValue: "",
      year: "",
      week: "",
      day: ""
    };
  }

  handleChange(event){
     this.setState({
       [event.target.id]: event.target.value
     });
  }

  handleGetSubmit(event){
    event.preventDefault();
    var gunUser = this.props.user;
    const state = this.state;

    let command = "gunUser" + this.state.getValue;
    eval(command);

    //How to get value from evaulated command?
  }

  handlePutSubmit(event){
    event.preventDefault();
    var gunUser = this.props.user;
    const state = this.state;

    var projects = ['Apple', 'Boeing', 'Cartel'];
    var tags = ['ATag', 'BTag', 'CTag', 'DTag', 'ETag']; //Need to be added as a gun set

    var concatString = this.state.year + '/' + this.state.week + '/' + this.state.day
    var yearWeek = this.state.year + '/' + this.state.week;

    var now = new Date();
    var then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0);
    var diff = now.getTime() - then.getTime();


    var timeEntryObj = {};
    timeEntryObj.created = Math.floor(now.getTime() / 1000);
    timeEntryObj.created_day = concatString;
    timeEntryObj.validity = concatString;
    timeEntryObj.validity_unix = diff;
    timeEntryObj.project = projects[Math.floor(Math.random() * projects.length)];
    timeEntryObj.task = "Task";
    timeEntryObj.checkIn = 0;
    timeEntryObj.checkInEdit = 0;
    timeEntryObj.checkInLastModified = 0;
    timeEntryObj.checkInDisplay = 0;
    timeEntryObj.checkOut = 1;
    timeEntryObj.checkOutEdit = 1;
    timeEntryObj.checkOutLastModified = 1;
    timeEntryObj.checkOutDisplay = 1,
    timeEntryObj.duration = 1;
    timeEntryObj.lastModified = 1;
    timeEntryObj.deleted = false;

    console.log(timeEntryObj);

    var getString = 'timeentry/' + timeEntryObj.created;

    gunUser.get(getString).put(timeEntryObj, function(ack) {
      if(ack.err) {
        console.log(ack.err);
      }
      else {
        console.log('put succeeded');
        const timeEntry = gunUser.get(getString);
        console.log(state.year);
        gunUser.get(state.year).set(timeEntry);
        gunUser.get(yearWeek).set(timeEntry);
        gunUser.get(concatString).set(timeEntry);
      }
    });
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="getValue">
          <ControlLabel>Get</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.getValue}
            onChange={this.handleChange.bind(this)}
          />
        </FormGroup>{' '}
        <FormGroup controlId="getOutput">
          <ControlLabel>Get Output</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.getOutput}
            onChange={this.handleChange.bind(this)}
          />
        </FormGroup>{' '}
        <Button onClick={this.handleGetSubmit.bind(this)} type="submit">Get</Button>
        <FormGroup controlId="year">
          <ControlLabel>Year</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.year}
            onChange={this.handleChange.bind(this)}
           />
        </FormGroup>{' '}
        <FormGroup controlId="week">
          <ControlLabel>Week</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.week}
            onChange={this.handleChange.bind(this)}
           />
        </FormGroup>{' '}
        <FormGroup controlId="day">
          <ControlLabel>Dat</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.day}
            onChange={this.handleChange.bind(this)}
           />
        </FormGroup>{' '}
        <FormGroup controlId="putValue">
          <ControlLabel>Put</ControlLabel>{' '}
          <FormControl
            type="text"
            value={this.state.putValue}
            onChange={this.handleChange.bind(this)}
           />
        </FormGroup>{' '}
        <Button onClick={this.handlePutSubmit.bind(this)} type="submit">Put</Button>
      </Form>

    );
  }
}
