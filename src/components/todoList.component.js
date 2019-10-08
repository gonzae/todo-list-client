import './todoList.component.css';

import _ from 'underscore';
import axios from 'axios';
import React, { Component } from 'react';
import { Container, ListGroup, Row, Col } from 'reactstrap';

import CreateTask from './createTask.component';
import FilterTasks from './filterTasks.component';
import Task from './task.component';

export default class TodoList extends Component {
  constructor(props) {
    super(props);

    this.completeTask = this.completeTask.bind(this);
    this.handleAddingTask = this.handleAddingTask.bind(this);
    this.applyFilter = this.applyFilter.bind(this);

    this.state = {
      tasks: [],
      filter: {}
    };
  }

  handleAddingTask(task) {
    let tasks = _.clone(this.state.tasks);
    tasks.push(task);

    this.setState({
      tasks: tasks
    });
  }

  applyFilter(filter) {
    this.setState({ filter });
    this._fetchTasks(filter);
  }

  async completeTask(id) {
    await axios.put('http://localhost:9000/api/tasks/'+id+'/complete');

    let tasks = _.clone(this.state.tasks);

    _.each(tasks, (thisTask) => {
      if(thisTask.id === id) thisTask.status = 'complete';
    });

    this.setState({
      tasks: tasks
    });
  }

  async componentDidMount() {
    await this._fetchTasks(this.state.filter);
  }

  async _fetchTasks(filter = null) {
    if( ! filter ) filter = this.state.filter;

    const res = await axios.get('http://localhost:9000/api/tasks/', { params: filter });

    this.setState({ tasks : res.data.tasks });
  }

  render() {
    return(
      <Container>
        <h1 className="mt-4">My ToDos</h1>
        <FilterTasks applyFilter={this.applyFilter} />
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