import './task-list.component.css';
import _ from 'underscore';
import React, { Component } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { faCircle, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CreateTask from './create-task.component';

class Task extends Component {
  constructor(props) {
    super(props);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      task: props.task
    };
  }

  handleCheckboxChange(task) {
    if( this.state.task.done !== 1 ) this.props.completeTask(this.state.task.id);
  }

  render() {
    const attachmentUrl = this.state.task.attachment ? `http://localhost:9000/${this.state.task.attachment}` : null;
    const done = this.state.task.done === 1;
    return(
      <ListGroupItem>
      <Row>
        <Col xs={1}>
        {done ? (
            <FontAwesomeIcon icon={faCheckCircle} size="lg" id="doneTask" style={{ color : '00b200' }} />
          ) : (
            <FontAwesomeIcon onClick={this.handleCheckboxChange} icon={faCircle} size="lg" id="pendingTask" style={{ cursor: 'pointer', color : 'gray' }} />
          )
        }
        </Col>
        <Col className="description" xs={9} style={
          done
          ? { 'text-decoration' : 'line-through' }
          : {}
        }>
          {this.state.task.description}
        </Col>
        <Col className="attachment" sm={2}>
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

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.completeTask = this.completeTask.bind(this);
    this.handleAddingTask = this.handleAddingTask.bind(this);

    this.state = {
      tasks: []
    };
  }

  handleAddingTask(task) {
    let tasks = _.clone(this.state.tasks);
    tasks.push(task);

    this.setState({
      tasks: tasks
    });
  }

  async completeTask(id) {
    await axios.put('http://localhost:9000/api/todos/'+id+'/complete');

    let tasks = _.clone(this.state.tasks);

    _.each(tasks, (thisTask) => {
      if(thisTask.id === id) thisTask.done = 1;
    });

    this.setState({
      tasks: tasks
    });
  }

  async componentDidMount() {
    const res = await axios.get('http://localhost:9000/api/todos/');

    this.setState({
      tasks: res.data.todos
    });
  }

  render() {
    return(
      <Container>
        <h1 className="mt-4">My ToDos</h1>
        <Row className="mb-4">
          <Col>
            <ListGroup>
              {
                this.state.tasks.map((thisTask) => {
                  return <Task task={thisTask} completeTask={this.completeTask} key={thisTask.id}/>
                })
              }
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <CreateTask taskAdded={this.handleAddingTask} />
          </Col>
        </Row>
      </Container>
    );
  }
};