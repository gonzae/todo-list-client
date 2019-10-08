import React, { Component } from 'react';
import axios from 'axios';

export default class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      description: '',
      selectedFile : null
    };
  }

  onChangeFile(e) {
    this.setState({
      selectedFile: e.target.files[0]
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    const task = {
      description: this.state.description
    };

    if(this.state.selectedFile) {
      const formData = new FormData(); 
      formData.append('file', this.state.selectedFile);

      const res = await axios.post('http://localhost:9000/api/todos/upload', formData);
      task.attachment = res.data.filename;
    }

    const res = await axios.post('http://localhost:9000/api/todos/', task);
    console.log(res.data);
    task.id = res.data.id;
    task.done = 0;

    this.props.taskAdded(task);

    this.setState({
      description: ''
    });
  }

  render() {
    return(
      <div>
        <h1>Create a new task:</h1>
        <input type="file" name="file" onChange={this.onChangeFile}/>
        <form onSubmit={this.onSubmit}>
          <input type="text"
            required
            value={this.state.description}
            onChange={this.onChangeDescription}
            />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
};