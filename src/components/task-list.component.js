import _ from 'underscore';
import React, { Component } from 'react';
import axios from 'axios';

import CreateTask from './create-task.component';

// const Task = props => (
//   <li>
//     <div>
//       <div>{props.task.description}</div>
//       <div>{props.task.done === 1 ? 'DONE' : <a href="#" onClick={() => { props.completeTask(props.task.id) }}>Complete!</a> }</div>
//       <div>{props.task.attachment ? <a href="http://localhost:9000/${ props.task.attachment }">attachment</a> : '' }</div>
//     </div>
//   </li>
// )

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: props.task
    };
  }

  render() {
    const attachmentUrl = this.state.task.attachment ? `http://localhost:9000/${this.state.task.attachment}` : null;
    return(
      <li>
        <div>
          {this.state.task.description}
          {
            this.state.task.done === 1
            ? 'DONE'
            : <a href="#" onClick={() => { this.props.completeTask(this.state.task.id) }}>Complete!</a>
          }
          {
            attachmentUrl
            ? <a rel="noopener noreferrer" target="_blank" href={attachmentUrl}>attachment</a>
            : ''
          }
        </div>
      </li>
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
      <div>
        <CreateTask taskAdded={this.handleAddingTask} />
        <h1>All tasks:</h1>
        <ul>
          {
            this.state.tasks.map((thisTask) => {
              return <Task task={thisTask} completeTask={this.completeTask} key={thisTask.id}/>
            })
          }
        </ul>
      </div>
    );
  }
};