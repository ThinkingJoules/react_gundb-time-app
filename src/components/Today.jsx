import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import _ from 'lodash'
import moment from 'moment';

import EditEntryModal from './EditEntryModal.jsx'

class Today extends Component {
  constructor(props) {
    super(props);

    this.state = { entries: [], duration: 0, show: false, dateValue: "", endTime: "", task: "", project: "", queryString: "" }
  }
  componentDidMount() {
  	const self = this;
    var user = this.props.user;
    var entries = this.state.entries;
    if(entries.length > 0) { entries = [] }
    var duration = this.state.duration;
	if(duration > 0) { duration = 0 }
    var query = this.args()

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
	} else {
		return
	}
  }

  args(){
    var d = new Date();
  	var isoWeek = moment(d).isoWeek();
  	var year = moment(d).year();
  	var day = moment(d).isoWeekday();
  	return year + '/' + isoWeek + '/' + day;
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
    return (
    	<Button key={entry.created} id={entry.created} onClick={() => {this.buttonClick(curEntry.created)}} className="list-group-item list-group-item-action">
        	{entry.validity}, Check in: {entry.checkInDisplay} Check out: {entry.checkOutDisplay}
      	</Button>
    )
  }

  render() {
    return (
      <div className="text-center">
      	<h1>Today</h1>
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
        />
      </div>
    );
  }
  showStatus () { return this.state.show }
  closeModal () { this.setState({show: false}) }
}

export default Today;
