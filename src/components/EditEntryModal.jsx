import React, { Component } from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";
import DatePicker from 'react-datetime'
import moment from 'moment';

import './datepicker.css'

export default class EditEntryModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      dateValue: "",
      endTime: "",
      task: "",
      project: "",
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
    var entryString = moment(stateDate).year() + '/' + moment(stateDate).isoWeek() +  '/' + moment(stateDate).isoWeekday();
    var nowString = moment(now).year() + '/' + moment(now).isoWeek() +  '/' + moment(now).isoWeekday();
    var weekString = moment(stateDate).year() + '/' + moment(stateDate).isoWeek();
    var year = moment(stateDate).year().toString();
    var startOfDay = moment(stateDate).startOf('day').unix();

    var newCheckIn = moment(stateDate).unix() - startOfDay;
    var newCheckOut = moment(stateDate).set({h: time[0], m: time[1]}).unix() - startOfDay;
    var newDuration = (newCheckOut - newCheckIn)/3600;

    gunUser.get(self.props.queryString).once(function(entry) {
      if(entry) {
        if(entry.validity_unix != startOfDay && !(self.state.endTime == '') ) {
          gunUser.get(self.props.queryString).get('checkOutEdit').put(newCheckOut, function(ack) {
            if(ack.err) {
              toastr['error']('Could not update check out');
            }
            else {
              toastr['success']('Check out updated');
              gunUser.get(self.props.queryString).get('checkOutLastModified').put(moment(now).unix(), function(ack) {
                if(ack.err) {
                  console.log(ack.err);
                  toastr['error']('Could not update check out last modified');
                }
                else {
                  gunUser.get(self.props.queryString).get('checkOutDisplay').put(moment.unix(startOfDay + newCheckOut).format('MM/DD/YYYY, hh:mm A'), function(ack) {
                    if(ack.err) {
                      console.log(ack.err);
                      toastr['error']('Could not update check out display');
                    }
                  });
                }
              });
            }
          });
        }
        if(entry.checkInEdit) {
          if(newCheckIn != entry.checkInEdit || entry.validity != entryString) {
            gunUser.get(self.props.queryString).get('checkInEdit').put(newCheckIn, function(ack) {
              if(ack.err) {
                toastr['error']('Could not update check in');
              }
              else {
                toastr['success']('Check in updated');
                gunUser.get(self.props.queryString).get('checkInLastModified').put(moment(now).unix(), function(ack) {
                  if(ack.err) {
                    console.log(ack.err);
                    toastr['error']('Could not update check in last modified');
                  }
                  else {
                    gunUser.get(self.props.queryString).get('checkInDisplay').put(moment.unix(startOfDay + newCheckIn).format('MM/DD/YYYY, hh:mm A'), function(ack) {
                      if(ack.err) {
                        console.log(ack.err);
                        toastr['error']('Could not update check in display');
                      }
                    });
                  }
                });
              }
            });
          }
        }
        else {
          if(newCheckIn != entry.checkIn || entry.validity != entryString) {
            gunUser.get(self.props.queryString).get('checkInEdit').put(newCheckIn, function(ack) {
              if(ack.err) {
                toastr['error']('Could not update check in');
              }
              else {
                toastr['success']('Check in updated');
                gunUser.get(self.props.queryString).get('checkInLastModified').put(moment(now).unix(), function(ack) {
                  if(ack.err) {
                    console.log(ack.err);
                    toastr['error']('Could not update check in last modified');
                  }
                  else {
                    gunUser.get(self.props.queryString).get('checkInDisplay').put(moment.unix(startOfDay + newCheckIn).format('MM/DD/YYYY, hh:mm A'), function(ack) {
                      if(ack.err) {
                        console.log(ack.err);
                        toastr['error']('Could not update check in display');
                      }
                    });
                  }
                });
              }
            });
          }
        }
        if(entry.checkOutEdit) {
          if(newCheckOut != entry.checkOutEdit) {
            gunUser.get(self.props.queryString).get('checkOutEdit').put(newCheckOut, function(ack) {
              if(ack.err) {
                toastr['error']('Could not update check out');
              }
              else {
                toastr['success']('Check in updated');
                gunUser.get(self.props.queryString).get('checkOutLastModified').put(moment(now).unix(), function(ack) {
                  if(ack.err) {
                    console.log(ack.err);
                    toastr['error']('Could not update check out last modified');
                  }
                  else {
                    gunUser.get(self.props.queryString).get('checkOutDisplay').put(moment.unix(startOfDay + newCheckOut).format('MM/DD/YYYY, hh:mm A'), function(ack) {
                      if(ack.err) {
                        console.log(ack.err);
                        toastr['error']('Could not update check out display');
                      }
                    });
                  }
                });
              }
            });
          }
        }
        else {
          if(newCheckOut != entry.checkOut && !(self.state.endTime == '') ) {
            gunUser.get(self.props.queryString).get('checkOutEdit').put(newCheckOut, function(ack) {
              if(ack.err) {
                toastr['error']('Could not update check out');
              }
              else {
                toastr['success']('Check in updated');
                gunUser.get(self.props.queryString).get('checkOutLastModified').put(moment(now).unix(), function(ack) {
                  if(ack.err) {
                    console.log(ack.err);
                    toastr['error']('Could not update check out last modified');
                  }
                  else {
                    gunUser.get(self.props.queryString).get('checkOutDisplay').put(moment.unix(startOfDay + newCheckOut).format('MM/DD/YYYY, hh:mm A'), function(ack) {
                      if(ack.err) {
                        console.log(ack.err);
                        toastr['error']('Could not update check out display');
                      }
                    });
                  }
                });
              }
            });
          }
        }
        if(self.state.task != entry.task) {
          gunUser.get(self.props.queryString).get('task').put(self.state.task, function(ack) {
            if(ack.err) {
              console.log(ack.err);
              toastr['error']('Could not update task');
            }
            else {
              toastr['success']('Task updated');
            }
          });
        }
        if(self.state.project != entry.project) {
          gunUser.get(self.props.queryString).get('project').put(self.state.project, function(ack) {
            if(ack.err) {
              console.log(ack.err);
              toastr['error']('Could not update project');
            }
            else {
              toastr['success']('Project updated');
            }
          });
        }
        if(!(self.state.endTime == '')) {
          gunUser.get(self.props.queryString).get('duration').put(newDuration, function(ack) {
            if(ack.err) {
              console.log(ack.err);
              toastr['error']('Could not update duration');
            }
            else {
              var diff = newDuration - entry.duration;
              self.props.diffDuration(diff);
            }
          });
        }
        gunUser.get(self.props.queryString).get('lastModified').put(moment(now).unix(), function(ack) {
          if(ack.err) {
            console.log(ack.err);
            toastr['error']('Could not update lastModified');
          }
        });
        gunUser.get(self.props.queryString).get('validity').put(entryString, function(ack) {
          if(ack.err) {
            console.log(ack.err);
            toastr['error']('Could not update validity');
          }
          else {
            gunUser.get(self.props.queryString).get('validity_unix').put(startOfDay, function(ack) {
              if(ack.err) {
                console.log(ack.err);
                toastr['error']('Could not update validity unix');
              }
            });
          }
        });
      }
      else {
        toastr['error']('Could not update time entry');
      }
      self.props.closeModal();
    });
  }

  render() {
    return (
      <Modal show={this.props.showStatus()} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Time Entry</Modal.Title>
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
            {this.props.showEndTime ? 
              <FormGroup controlId="endTime">
              <ControlLabel>End Time</ControlLabel>{' '}
              <FormControl
                id="endTime"
                type="time"
                value={this.state.endTime}
                onChange={this.handleChange.bind(this)}
               />
              </FormGroup> : <p><b>Timer still running</b></p> 
            }
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