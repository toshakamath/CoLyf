import React, { Component } from "react";
import "antd/dist/antd.css";
import "./Dashboard.css";
import axios from "axios";

//import DashboardCharts from "./DashboardCharts";

import { Row, Col, Select } from "antd";
import DashboardCharts from "./DashboardCharts";

class Dashboard extends Component {
  render() {
    const Option = Select.Option;

    let chartData = [
      {
        title: "Weekly Completion Statistics",
        yAxisTitle: "Task Completion (%)",
        color: "#ff6361",
        name: "weekly",
        data: [
          ["Atul Gutal", 95],
          ["Hrishikesh Waikar", 95],
          ["Bhaskar Gurram", 95],
          ["Rohit Shapkal", 90],
          ["Sagar Bonde", 85],
          ["Vinit Dholakia", 80],
          ["Pranav Dixit", 75]
        ]
      },
      {
        title: "Monthly Completion Statistics",
        yAxisTitle: "Task Completion (%)",
        color: "#bc5090",
        name: "Monthly",
        data: [
          ["Atul Gutal", 95],
          ["Hrishikesh Waikar", 95],
          ["Bhaskar Gurram", 95],
          ["Rohit Shapkal", 80],
          ["Sagar Bonde", 70],
          ["Vinit Dholakia", 85],
          ["Pranav Dixit", 75]
        ]
      }
    ];

    return (
      <Row>
        <Row>
          <Col span={24}>
            <Col span={8}>
              <h3 className="dashboardChartTitle"> Dashboard </h3>{" "}
            </Col>
          </Col>
        </Row>
        <Row>
          {chartData.map((value, i) => (
            <Col span={12}>
              <DashboardCharts value={value} />
            </Col>
          ))}
        </Row>
      </Row>
    );
  }
}

export default Dashboard;
