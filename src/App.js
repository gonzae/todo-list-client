import './index.css';
import React, { Component } from 'react';
import TodoList from './components/todoList.component';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TodoList />
      </div>
    )
  }
}
export default App