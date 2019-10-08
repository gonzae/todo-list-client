import './index.css';
import React, { Component } from 'react';
import TaskList from './components/task-list.component';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TaskList />
      </div>
    )
  }
}
export default App