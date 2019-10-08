import './todoList.component.css';

import React, { Component } from 'react';
import { ListGroupItem, Row, Col } from 'reactstrap';
import { faCircle, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Task extends Component {
  constructor(props) {
    super(props);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      id: props.task.id,
      description: props.task.description,
      attachment: props.task.attachment,
      status: props.task.status,
    };
  }

  handleCheckboxChange() {
    this.setState({status: 'complete'});

    if( this.state.status === 'pending' ) this.props.completeTask(this.state.id);
  }

  render() {
    const attachmentUrl = this.state.attachment ? `http://localhost:9000/${this.state.attachment}` : null;
    const taskIsComplete = this.state.status === 'complete';
    return(
      <ListGroupItem>
      <Row>
        <Col xs={1}>
        {taskIsComplete ? (
            <FontAwesomeIcon icon={faCheckCircle} size="lg" style={{ color : '00b200' }} />
          ) : (
            <FontAwesomeIcon onClick={this.handleCheckboxChange} icon={faCircle} size="lg" style={{ cursor: 'pointer', color : 'gray' }} />
          )
        }
        </Col>
        <Col className="description" xs={9} style={
          taskIsComplete
          ? { textDecoration : 'line-through' }
          : {}
        }>
          {this.state.description}
        </Col>
        <Col className="attachment" xs={2}>
          {
            attachmentUrl
            ? <a rel="noopener noreferrer" target="_blank" href={attachmentUrl} style={{ color : 'gray' }}>(File attached)</a>
            : ''
          }
        </Col>
      </Row>
      </ListGroupItem>
    );
  }
}