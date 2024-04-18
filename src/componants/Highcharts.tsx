import React, { useEffect } from "react";
import Highcharts from "highcharts";

const MyChartComponent = () => {
  useEffect(() => {
    // チャートの初期化
    const chart = Highcharts.chart("container", {
      title: {
        text: "My Chart",
      },
      xAxis: {
        title: {
          text: "年度",
        },
      },
      yAxis: {
        title: {
          text: "人口数",
        },
        labels:{
          style:{
            color:"green"
          },
        }
      },
      series: [
        {
          color:"blue",
          type: "line",
          data: [1, 2, 3, 4, 500000],
        },
        {
          color:"red",
          type:"line",
          data:[10000,200,4000000,]
        }
      ],
    });

    // コンポーネントがアンマウントされたときにチャートを破棄する
    return () => {
      chart.destroy();
    };
  }, []);

  return <div id="container" style={{ width: "100%", height: "400px" }}></div>;
};

export default MyChartComponent;
