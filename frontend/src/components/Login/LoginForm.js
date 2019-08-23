import React, { Component } from 'react'
import { Input, Button, Divider, Icon, message } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class LoginForm extends Component {
    state = {
        passcode: "",
        account_name: ""
    }

    handleChange = (e) => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleLogin = () => {
        console.log(this.state.passcode)
        const { account_name, passcode } = this.state;
        axios({
            method: 'post',
            url: '/login',
            data: {
                account_name,
                passcode
            }
        })
            .then(response => {
                console.log(response)
                localStorage.setItem("homeId", response.data.homeId)
                localStorage.setItem("homeName", response.data.homeName)
                localStorage.setItem("personData", JSON.stringify(response.data.personData))
                message.success("Logged in successfully")
                this.props.history.push("/")
            })
            .catch(err => {
                console.log(err)
                message.error("Wrong username or password")
            })
    }
    render() {
        const { passcode,account_name } = this.state;
        const { toggleForms } = this.props;
        return (
            <div style={{ display: "flex", flexDirection: "column", width: "40%", margin: "40px 30%" }}>
                <Input value={account_name} onChange={this.handleChange} name="account_name" placeholder="Please enter Account name" prefix={<Icon type="home" />} style={{ textAlign: "center", marginBottom: "20px" }} />
                <Input value={passcode} type="password" onChange={this.handleChange} name="passcode" placeholder="Please enter passcode" prefix={<Icon type="lock" />} style={{ textAlign: "center" }} />
                <Button type="primary" onClick={this.handleLogin} style={{ marginTop: "20px" }} icon="login">Enter</Button>
                <Divider />
                <Button onClick={toggleForms} icon="user">Register</Button>

            </div>
        )
    }
}

export default withRouter(LoginForm)