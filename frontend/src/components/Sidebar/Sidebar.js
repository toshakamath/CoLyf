import React from "react";
import { Layout, Menu, Icon, Typography, message } from "antd";
import { Switch, Route } from "react-router-dom";
import Home from "../Home/Home";
import logo from '../../assets/colyf.png'
import OneTime from "../OneTime/OneTime";
import Daily from "../Daily/Daily";
import Weekly from "../Weekly/Weekly";
import Monthly from "../Monthly/Monthly";
import AddPeople from "../AddPeople/AddPeople";
import AddTask from "../AddTask/AddTask";
import AddList from "../AddList/AddList";
import Dashboard from "../Dashboard/Dashboard";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

class Sidebar extends React.Component {
  state = {
    collapsed: false
  };

  componentDidMount() {
    if (!localStorage.getItem("homeId")) {
      message.error("Please login!");
      this.props.history.push("/login");
    }
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleClick = ({ key }) => {
    key = key === "home" ? "" : key;
    this.props.history.push(`/${key}`);
  };

  handleLogout = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };
  render() {
    const { content } = this.props;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["home"]}
            mode="inline"
            onClick={this.handleClick}
          >
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", padding: "20px 0"}}>
            <img src={logo} style={{width:"50px", height: "50px"}}/>
            {/* <span>CoLyf</span> */}
            </div>
            <Menu.Item key="home">
              <Icon type="pie-chart" />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item key="dashboard">
              <Icon type="pie-chart" />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="daily">
              <Icon type="solution" />
              <span>Daily</span>
            </Menu.Item>
            <Menu.Item key="weekly">
              <Icon type="schedule" />
              <span>Weekly</span>
            </Menu.Item>
            <Menu.Item key="monthly">
              <Icon type="calendar" />
              <span>Monthly</span>
            </Menu.Item>
            <Menu.Item key="addPeople">
              <Icon type="user-add" />
              <span>Add People</span>
            </Menu.Item>
            <Menu.Item key="addList">
              <Icon type="plus-circle" />
              <span>Add List</span>
            </Menu.Item>
            <Menu.Item key="addTask">
              <Icon type="plus-circle" />
              <span>Add Task</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#FFF", padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "600",
                  fontSize: "20px"
                }}
              >
                {localStorage.getItem("homeName")}
              </div>
              <div
                style={{ marginRight: "20px", cursor: "pointer" }}
                onClick={this.handleLogout}
              >
                <Icon type="logout" />
                &nbsp;Logout
              </div>
            </div>
          </Header>
          <Content style={{ margin: "16px 16px" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: "90vh" }}>
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/daily" component={Daily} />
                <Route path="/weekly" component={Weekly} />
                <Route path="/monthly" component={Monthly} />
                <Route path="/addPeople" component={AddPeople} />
                <Route path="/addList" component={AddList} />
                <Route path="/addTask" component={AddTask} />
                <Route path="/" exact component={Home} />
              </Switch>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Sidebar;
