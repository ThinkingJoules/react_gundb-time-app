import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import TimeEntry from './TimeEntry.jsx'
import _ from 'lodash'

export default class Year extends Component {
  constructor(props) {
    super(props);

    this.state = { entries: [], duration: 0 };
  }

  componentDidMount() {
    const self = this;
    var user = this.props.user;
    var entries = this.state.entries;
    var duration= this.state.duration;

    user.get('2018').map().on(function(entry, id) {
      let data = { id: id, data: entry}
      const merged = _.merge(data,entry);
      console.log(merged);
      const index = _.findIndex(entries, (o)=>{ return o.id === id});
      if(index >= 0) {
        entries[index] = merged;
      }else{
        entries.push(merged);
        duration += entry.duration
      }
      self.setState({entries});
      self.setState({duration});
    });
  }

  getEntryItem(entry) {
    return (<ListGroupItem key={entry.created_day} id={entry.created_day}>
      {entry.created_day}
    </ListGroupItem>)
  }

  render() {
    return (
      <div>
        <h1>Year Listing</h1>
        <h2>Total Duration: {this.state.duration}</h2>
        <ListGroup>
          {this.state.entries.map(this.getEntryItem.bind(this))}
        </ListGroup>
      </div>
    );
  }
}
