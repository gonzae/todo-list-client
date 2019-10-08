import './todoList.component.css';

import _ from 'underscore';
import axios from 'axios';
import React, { Component } from 'react';
import { Container, ListGroup, Row, Col, Input } from 'reactstrap';
import {
  InputGroup,
  InputGroupButtonDropdown,
  Button,
  Form,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

import CreateTask from './createTask.component';
import Task from './task.component';

export default class TodoList extends Component {
  constructor(props) {
    super(props);

    this.completeTask = this.completeTask.bind(this);
    this.handleAddingTask = this.handleAddingTask.bind(this);
    this.handleDescriptionFilterChange = this.handleDescriptionFilterChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.applyFilter = this.applyFilter.bind(this);

    this.state = {
      tasks: [],
      dropdownOpen: false,
      descriptionFilter: '',
      statusFilter: 'All tasks'
    };
  }

  dropdownToggle(e) {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleAddingTask(task) {
    let tasks = _.clone(this.state.tasks);
    tasks.push(task);

    this.setState({
      tasks: tasks
    });
  }

  handleStatusFilterChange(e) {
    this.setState({
      statusFilter: e.currentTarget.textContent
    });
  }

  handleDescriptionFilterChange(e) {
    this.setState({
      descriptionFilter: e.target.value
    });
  }

  async applyFilter(e) {
    e.preventDefault();
    const tasks = await this._fetchTasks();

    this.setState({ tasks });    
  }

  async completeTask(id) {
    await axios.put('http://localhost:9000/api/tasks/'+id+'/complete');

    let tasks = _.clone(this.state.tasks);

console.log(tasks);

    _.each(tasks, (thisTask) => {
console.log(thisTask);
      if(thisTask.id === id) thisTask.status = 'complete';
    });

    this.setState({
      tasks: tasks
    });
  }

  async componentDidMount() {
    const tasks = await this._fetchTasks();

    this.setState({ tasks });
  }

  async _fetchTasks() {
    const params = {
      description : this.state.descriptionFilter,
    };

    let status;
    switch( this.state.statusFilter ) {
      case 'Only pending':
        status = 'pending';
        break;
      case 'Only complete':
        status = 'complete';
        break;
      case 'All':
      default:
        status = null;
        break;
    }

    if(status != null) {
      params.status = status;
    }

    const res = await axios.get('http://localhost:9000/api/tasks/', {params});
    return res.data.tasks;
  }

  render() {
    return(
      <Container>
        <h1 className="mt-4">My ToDos</h1>
        <Form onSubmit={this.applyFilter}>
          <Row className="mb-4">
            <Col sm={10}>
              <InputGroup>
                <Input type="text"
                name="descriptionFilter"
                id="descriptionFilter"
                placeholder="Filter tasks..."
                value={this.state.descriptionFilter}
                onChange={this.handleDescriptionFilterChange}
                />
                <InputGroupButtonDropdown addonType="append"
                  isOpen={this.state.dropdownOpen}
                  toggle={this.dropdownToggle}
                  value={this.state.statusFilter}
                  >
                  <DropdownToggle caret>
                    {this.state.statusFilter}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={this.handleStatusFilterChange}>All tasks</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={this.handleStatusFilterChange}>Only pending</DropdownItem>
                    <DropdownItem onClick={this.handleStatusFilterChange}>Only complete</DropdownItem>
                  </DropdownMenu>
                </InputGroupButtonDropdown>
              </InputGroup>
            </Col>
            <Col sm={2}>
              <Button outline block color="secondary">Apply filter</Button>
            </Col>
          </Row>
        </Form>
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