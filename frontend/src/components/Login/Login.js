import React, { Component } from 'react'
import { Row, Col, Card } from 'antd';
import LoginForm from './LoginForm';
import logo from '../../assets/login.png';
import RegisterForm from './RegisterForm';

class Login extends Component {
    state = {
        showRegisterForm: false
    }

    toggleForms = () => {
        // this.p
        this.setState({
            showRegisterForm: !this.state.showRegisterForm
        })
    }
    render() {
        const { code, showRegisterForm } = this.state;
        return (
            <div>
                <Row justify="center" type="flex" style={{ marginTop: "50px" }}>
                    <Col xs={20} md={12}>
                        <Card
                            style={{ textAlign: "center" }}
                        >
                            <img src={logo} style={{ width: "30%" }} />
                            {
                                showRegisterForm ?
                                    <RegisterForm
                                        toggleForms={this.toggleForms}
                                    />
                                    :
                                    <LoginForm
                                        toggleForms={this.toggleForms}
                                    />
                            }

                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Login;