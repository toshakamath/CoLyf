import React, { Component } from 'react'
import { Button, Input, Divider, Icon, message } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios'

class RegisterForm extends Component {
    state = {
        home: "",
        account_name: "",
        persons: [{
            name: "",
            email: ""
        }]
    }

    handleChange = (e, i) => {
        const { persons } = this.state;
        persons[i][e.target.name] = e.target.value;
        this.setState({
            persons
        })
    }

    handleRemove = (i) => {
        const { persons } = this.state
        persons.splice(i, 1)
        this.setState({
            persons
        })
    }

    handleAddPerson = () => {
        const { persons } = this.state
        const newPerson = {
            name: "",
            email: ""
        }
        persons.push(newPerson)
        this.setState({
            persons
        })
    }

    handleHomeChange = (e) => {
        this.setState({
            home: e.target.value
        })
    }

    handleAccountNameChanged = (e) => {
        this.setState({
            account_name: e.target.value
        })
    }
    handleRegister = () => {
        console.log(this.state.persons)
        console.log(this.state.home)
        const { persons, home, account_name } = this.state;
        let data = {
            persons,
            account_name,
            home_name: home
        }
        axios({
            method: 'post',
            url: "/home",
            data
        })
            .then(response => {
                console.log(response)
                localStorage.setItem("homeId", response.data.homeId)
                localStorage.setItem("homeName", response.data.homeName)
                localStorage.setItem("personData", JSON.stringify(response.data.personData))
                message.success("Home created successfully")
                this.props.history.push("/")
            })
            .catch(err => {
                message.error("Please enter all the details!")
                console.log(err)
            })

    }
    render() {
        const { persons, home, account_name } = this.state;
        const { toggleForms } = this.props;
        return (
            <div style={{ margin: "40px 0" }}>
                <div>
                    <Input name="name" prefix={<Icon type="home" />} onChange={this.handleHomeChange} value={home} placeholder="Home name" style={{ margin: "10px 0" }}/>
                </div>
                <div>
                    <Input name="account_name" prefix={<Icon type="user" />} onChange={this.handleAccountNameChanged} value={account_name} placeholder="Account Name" />
                </div>
                {
                    persons.map((person, i) => (
                        <div style={{ display: "flex", marginTop: "10px" }} key={i}>
                            <Input prefix={<Icon type="user" />} value={persons[i].name} name="name" onChange={(e) => this.handleChange(e, i)} placeholder="name" style={{ marginRight: "10px" }} />
                            <Input prefix={<Icon type="mail" />} value={persons[i].email} name="email" type="email" onChange={(e) => this.handleChange(e, i)} placeholder="email" style={{ marginRight: "10px" }} />
                            <Button type="danger" icon="minus"  onClick={() => this.handleRemove(i)} />
                        </div>
                    ))
                }
                <div>
                    <Button icon="user-add" style={{ width: "40%", marginTop: "10px" }}  onClick={this.handleAddPerson}>Add More</Button>
                </div>

                <Button type="primary"  onClick={this.handleRegister} style={{ width: "40%", marginTop: "40px" }} icon="user">Register</Button>
                <Divider />
                <p>Already have an account?</p>
                <Button onClick={toggleForms} style={{ width: "40%" }} icon="login">Login</Button>
            </div>
        )
    }
}

export default withRouter(RegisterForm);