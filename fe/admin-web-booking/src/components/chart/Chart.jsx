import React from "react";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
const Chart = ({ dataChart, height, title }) => {
  const { typeMoney } = useSelector((state) => state.global);

  const moneyAdapter = (money, type) => {
    var m = 0;
    if (type === "VND") {
      m = money.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
    } else if (type === "USD") {
      m = (money / 23000).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
    return m.split(".")[1] === "00" ? m.split(".")[0] : m;
  };

  var data1to6 = [
    {
      name: "January",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "February",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "March",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "April",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "May",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "June",
      Total: 0,
      showTotal: 0,
    },
  ];

  var data7to12 = [
    {
      name: "July",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "August",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "September",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "October",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "November",
      Total: 0,
      showTotal: 0,
    },
    {
      name: "December",
      Total: 0,
      showTotal: 0,
    },
  ];

  const handlePushData = () => {
    dataChart?.forEach((item) => {
      if (item.status !== "Cancelled") {
        const date = new Date(item.created_at);
        if (date.getMonth() >= 0 && date.getMonth() <= 5) {
          data1to6[date.getMonth()].Total += item.total;
          data1to6[date.getMonth()].showTotal = moneyAdapter(
            data1to6[date.getMonth()].Total,
            typeMoney
          );
        } else if (date.getMonth() >= 6 && date.getMonth() <= 11) {
          data7to12[date.getMonth() - 6].Total += item.total;
          data7to12[date.getMonth() - 6].showTotal = moneyAdapter(
            data7to12[date.getMonth() - 6].Total,
            typeMoney
          );
        }
      }
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="intro">{label}</p>
          <p className="label">{`Total : ${payload[0].payload.showTotal}`}</p>
        </div>
      );
    }
  };

  return (
    <div className="chart">
      <div className="title">
        {title}
        {handlePushData()}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          width={730}
          height={250}
          data={data1to6}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
