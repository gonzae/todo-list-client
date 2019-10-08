import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  Button,
  Form,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
 } from 'reactstrap';

export default class TodoList extends Component {
  constructor(props) {
    super(props);

    this.handleDescriptionFilterChange = this.handleDescriptionFilterChange.bind(this);
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
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

  onSubmit(e) {
    e.preventDefault();
    const filter = {};
    if(this.state.descriptionFilter !== '') {
      filter.description = this.state.descriptionFilter;
    }

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
      filter.status = status;
    }

    this.props.applyFilter(filter);
  }

  render() {
    return(
      <Form onSubmit={this.onSubmit}>
        <Row className="mb-4">
          <Col xs={8}>
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
          <Col xs={4}>
            <Button outline block color="secondary">Apply filter</Button>
          </Col>
        </Row>
      </Form>
    );
  }
};