import React, { Component } from 'react';
import { Form, FormGroup, Col, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class CreateTask extends Component {
  constructor(props) {
    super(props);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      description: '',
      selectedFile : null,
      filename : ''
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

      const res = await axios.post('http://localhost:9000/api/files/', formData);
      task.attachment = res.data.filename;
    }

    const res = await axios.post('http://localhost:9000/api/tasks/', task);
    task.id = res.data.id;
    task.status = 'pending';

    this.props.taskAdded(task);

    this.setState({
      description: '',
      selectedFile : null,
      filename : ''
    });
  }

  render() {
    return(
      <Form onSubmit={this.onSubmit}>
        <FormGroup row>
          <Col>
            <Input type="text"
              name="newTask"
              id="newTask"
              placeholder="Write a new task and press 'Enter' key..."
              ref={(input) => { this.descriptionInput = input; }} 
              required
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Label for="uploadAttachment">Attach file before saving the task:</Label>
          <Input type="file"
            name="file"
            id="uploadAttachment"
            onChange={this.onChangeFile}
            />
        </FormGroup>
      </Form>
    );
  }
};