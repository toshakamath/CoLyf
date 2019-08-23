import React, { Component } from 'react'
import AssignedTask from '../common/AssignedTask';
import axios from 'axios'
import { Empty, Row, Col, Skeleton, Card, Typography, Button, message } from 'antd'
import TaskCard from '../common/TaskCard';
const { Title, Text } = Typography


export default class Weekly extends Component {
  state = {
    tasks: [],
    loading: true,
    allTasks: [{
      taskName: "Cleaning",
      taskId: "1",
      people: "Bhaskar"
    }, {
      taskName: "Cleaning bathroon",
      taskId: "2",
      people: "Atul"
    },
    ]
  }
  getData = () => {
    Promise.all([axios({
      method: 'get',
      url: '/assignment/weekly?homeId=' + localStorage.getItem("homeId"),
    }),
    axios({
      method: 'get',
      url: '/task?homeId=' + localStorage.getItem("homeId") + "&rotationType=WEEKLY",
    })]
    )
      .then(response => {
        console.log(response)
        console.log(response.data)
        this.setState({
          tasks: response[0].data,
          loading: false,
          allTasks: response[1].data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  componentDidMount() {
    this.getData();
  }
  handleMarkComplete = (_id) => {
    console.log(_id)
    let { tasks } = this.state;
    tasks = tasks.map(task => {
      if (task.id === _id) task.done = true;
      return task
    })
    console.log(tasks)
    this.setState({
      tasks
    })
    axios({
      method: "post",
      url: '/assignment/mark_complete',
      data: {
        taskAssignmentId: _id
      }
    })
      .then(response => {
        this.getData();
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleDeleteTask = (taskId) => {
    console.log(taskId)
    let { allTasks } = this.state;
    allTasks = allTasks.filter(task => task.id !== taskId)
    message.success("Task was deleted successfully!")
    this.setState({
      allTasks
    })
  }
  handleAssignTask = (taskId) => {
    console.log(taskId)
    axios({
      method: "post",
      url: '/task/assign',
      data: {
        taskId
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    const { tasks, loading, allTasks } = this.state
    return (
      <div>
        <Row gutter={24}>

          <Col span={10}>
            <Title level={4}>All Weekly Assignments</Title>
            {
              loading ?
                <Skeleton active /> :
                tasks.length > 0 ?

                  tasks.map(task => (
                    <AssignedTask task={task} handleMarkComplete={this.handleMarkComplete} />
                  ))
                  :
                  <Empty description="No tasks assigned" />
            }

          </Col>
          <Col offset={4} span={10}>
            <Title level={4}>All Weekly tasks</Title>
            {
              loading ?
                <Skeleton active /> :
                allTasks.length > 0 ?

                  allTasks.map(task => (
                    <TaskCard task={task} handleDeleteTask={this.handleDeleteTask} handleAssignTask={this.handleAssignTask} />
                  ))
                  :
                  <Empty description="No weekly tasks" />
            }
          </Col>
        </Row>
      </div>
    )
  }
}


