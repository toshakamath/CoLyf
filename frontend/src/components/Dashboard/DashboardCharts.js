import React, { Component } from "react";
import "antd/dist/antd.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class DashboardCharts extends Component {
  render() {
    const options = {
      chart: {
        height: 400,
        width: 600,
        type: "column"
      },

      title: {
        text: this.props.value.title
      },
      //   xAxis: {
      //     //visible: true,
      //     categories: this.props.xAxis
      //   },
      xAxis: {
        type: "category",
        labels: {
          style: {
            fontSize: "10px",
            fontFamily: "Verdana, sans-serif"
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: this.props.value.yAxisTitle,
          style: {
            fontSize: "15px",
            fontFamily: "Verdana, sans-serif"
          }
        }
      },
      series: [
        {
          name: this.props.name,
          showInLegend: false,
          type: "bar",
          //   data: this.props.graphData,
          data: this.props.value.data,
          color: this.props.value.color
        }
      ],
      credits: {
        enabled: false
      }
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"chart"}
        options={options}
      />
    );
  }
}

export default DashboardCharts;
