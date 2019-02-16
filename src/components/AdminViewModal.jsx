import React, { Component } from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel, Form } from "react-bootstrap";
import moment from 'moment';

export default class AdminViewModal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleClose() {
    this.props.closeModal();
  }

  render() {
    return (
      <Modal show={this.props.showStatus()} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Time Entry for {this.props.alias}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p><b>Created:</b> {moment.unix(this.props.entry.created).format('MM/DD/YYYY, hh:mm A')}</p>
          <p><b>Original Check-In:</b> {this.props.entry.checkIn ? moment.unix(this.props.entry.validity_unix + this.props.entry.checkIn).format('MM/DD/YYYY, hh:mm A') : 'No original check-in'}</p>
          <p><b>Edited Check-In:</b> {this.props.entry.checkInEdit ? moment.unix(this.props.entry.validity_unix + this.props.entry.checkInEdit).format('MM/DD/YYYY, hh:mm A') : 'No edit'}</p>
          <p><b>Check-In Last Modified:</b> {moment.unix(this.props.entry.checkInLastModified).format('MM/DD/YYYY, hh:mm A')}</p>
          <p><b>Original Check-Out:</b> {this.props.entry.checkOut ? moment.unix(this.props.entry.validity_unix + this.props.entry.checkOut).format('MM/DD/YYYY, hh:mm A') : 'No original check-in'}</p>
          <p><b>Edited Check-Out:</b> {this.props.entry.checkOutEdit ? moment.unix(this.props.entry.validity_unix + this.props.entry.checkOutEdit).format('MM/DD/YYYY, hh:mm A') : 'No edit'}</p>
          <p><b>Check-Out Last Modified:</b> {moment.unix(this.props.entry.checkOutLastModified).format('MM/DD/YYYY, hh:mm A')}</p>
          <p><b>Duration:</b> {this.props.entry.duration} hrs</p>
          <p><b>Task:</b> {this.props.entry.task ? this.props.entry.task : 'None'}</p>
          <p><b>Project:</b> {this.props.entry.project ? this.props.entry.project : 'None'}</p>
          <p><b>Last Modified:</b> {moment.unix(this.props.entry.lastModified).format('MM/DD/YYYY, hh:mm A')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}