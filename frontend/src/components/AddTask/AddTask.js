import React, { Component } from 'react'
import { Card, DatePicker, Input, Select, Button, Icon, Checkbox, message } from 'antd';
import axios from 'axios';
const { RangePicker } = DatePicker;

const { Option } = Select;

class AddTask extends Component {
  state = {
    people: [
      {
        name: "Bhaskar Gurram",
        _id: "5ccd0f8ed0879970a0d4615b"
      },
      {
        name: "Rohit",
        _id: "5ccd0f8ed0879970a0d4615c"
      },
      {
        name: "Sagar",
        _id: "5ccd0f8ed0879970a0d4615d"
      },
      {
        name: "Hrishikesh",
        _id: "5ccd0f8ed0879970a0d4615e"
      },
      {
        name: "Vinit",
        _id: "5ccd0f8ed0879970a0d4615f"
      },
    ],
    startNow: false,

  }
  data = {
    rotation_type: "DAILY",
    task_name: "",
    startNow: false,
    person_ids: [],
    startDate: null
  }

  componentDidMount() {
    let people = JSON.parse(localStorage.getItem('personData'))
    console.log(people)
    this.setState({
      people
    })
  }
  handleDateChange = (date, dateString) => {
    console.log(date, dateString)
    this.data.startDate = date;
  }

  toggleCheckbox = (e) => {
    this.setState({
      startNow: e.target.checked
    })
    this.data.startNow = e.target.checked
  }

  handlePeopleSelect = (name) => {
    console.log(name)
    const { people } = this.state;
    const person_ids = [];
    people.forEach(p => {
      if (name.indexOf(p.name) !== -1) person_ids.push(p.id)
    })
    console.log(person_ids)
    this.data.person_ids = person_ids;
  }

  handleChange = (e) => {
    this.data.task_name = e.target.value
  }
  handleDurationSelect = (name) => {
    this.data.rotation_type = name;
  }

  handleSubmit = () => {
    let homeId = localStorage.getItem("homeId");
    console.log(homeId)
    if (this.data.startNow) this.data.startDate = "NOW"
    this.data.homeId = homeId;
    console.log(this.data)
    axios({
      method: 'post',
      url: '/task/create',
      data: this.data
    })
      .then(response => {
        message.success("Task was created Successfulll!")
        this.props.history.push("/");
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    const { people, startNow } = this.state
    return (
      <div>
        <Card
          title="New Task"
          style={{ width: "50%" }}
          actions={[
            <Button onClick={this.handleSubmit} type="primary">Create Task</Button>
          ]}
        >
          <div style={{ marginBottom: "15px" }}>

            <Input placeholder="Task name" onChange={this.handleChange} name="name" />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={this.handlePeopleSelect}
            >
              {people.map(p => (
                <Option key={p.name}>{p.name}</Option>
              ))}
            </Select>
          </div>
          <div style={{ margin: "15px 0" }}>
            <Select defaultValue="DAILY" onChange={this.handleDurationSelect} style={{ width: "100%" }}>
              <Option key="DAILY">Daily</Option>
              <Option key="WEEKLY">Weekly</Option>
              <Option key="MONTHLY">Monthly</Option>
            </Select>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox onChange={this.toggleCheckbox} value={startNow}>Start Now</Checkbox>
            <DatePicker onChange={this.handleDateChange} disabled={startNow} />
          </div>

        </Card>
      </div>
    )
  }
}
export default AddTask