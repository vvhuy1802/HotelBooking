import React, { useState, useRef, useCallback, useEffect } from "react";
import { moneyAdapter } from "../../functions/Adapter";
import "./revenue.scss";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useSelector } from "react-redux";

import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import { GetOrderByDate } from "../../middlewares/order";

import {
  BarChart,
  AreaChart,
  Bar,
  Cell,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

function Day(props) {
  const { day, selectedDay, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const start = selectedDay.startOf("week");
  //check if end is in the future
  const end = selectedDay.endOf("week").isAfter(dayjs())
    ? dayjs()
    : selectedDay.endOf("week");

  const dayIsBetween = day.isBetween(start, end, null, "[]");
  const isFirstDay = day.isSame(start, "day");
  const isLastDay = day.isSame(end, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

function Custom(props) {
  const { day, firstDay, lastDay, ...other } = props;

  if (firstDay === "" || lastDay === "") {
    return <PickersDay day={day} {...other} />;
  }

  const isBetween = day.isBetween(firstDay, lastDay, null, "[]");
  const isFirstDay = day.isSame(firstDay, "day");
  const isLastDay = day.isSame(lastDay, "day");

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={isBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={isBetween}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
    />
  );
}

function Revenue() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [valueDay, setValueDay] = useState();
  const [valueWeek, setValueWeek] = useState();
  const [valueMonth, setValueMonth] = useState();
  const [valueCustom, setValueCustom] = useState({
    startDate: "",
    endDate: "",
  });
  const [dataChart, setDataChart] = useState([]);
  const isFirstChoise = useRef(true);
  const [loading, setLoading] = useState(true);
  const [typeSelect, setTypeSelect] = useState("day");
  const [typeShow, setTypeShow] = useState("Today:");

  const { typeMoney, totalOrder } = useSelector((state) => state.global);

  var dataByYear = [];
  var startYear = 2021;
  var endYear = 2023;

  for (var year = startYear; year <= endYear; year++) {
    var dataMonths = [];
    for (var month = 0; month < 12; month++) {
      dataMonths.push({
        name: getMonthName(month),
        indexMonth: month + 1,
        Total: 0,
        showTotal: 0,
        count: 0,
        orders: [],
      });
    }
    dataByYear.push({ year: year, dataMonths: dataMonths });
  }

  function getMonthName(month) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  }

  const handlePushData = () => {
    totalOrder.data?.forEach((item) => {
      if (item.status !== "Cancelled") {
        const date = new Date(item.check_in);
        const month = date.getMonth();
        const year = dataByYear.findIndex((x) => x.year === date.getFullYear());

        dataByYear[year].dataMonths[month].Total += item.total;
        dataByYear[year].dataMonths[month].showTotal = moneyAdapter(
          dataByYear[year].dataMonths[month].Total,
          typeMoney
        );
        dataByYear[year].dataMonths[month].count += 1;
        dataByYear[year].dataMonths[month].orders.push(item);
      }
    });
  };

  useEffect(() => {
    handlePushData();
  }, []);

  const formatD = (date) => {
    //format like 2023-6-21
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleFormatDate = async (data, s, e) => {
    const dataByDate = [];
    const start = new Date(s);
    const end = new Date(e);

    const startD = new Date(start.toISOString().split("T")[0]);
    const endD = new Date(end.toISOString().split("T")[0]);
    const timeDiff = Math.abs(endD.getTime() - startD.getTime());
    const numDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));

    if (numDays === 0) {
      const date = new Date(s);
      const dateF = formatD(date);
      const item = {
        date: dateF,
        total: 0,
        showTotal: 0,
        count: 0,
        name: formatDate(date).split(",")[0],
      };
      dataByDate.push(item);
    } else {
      for (let i = 0; i < numDays; i++) {
        const date = new Date(s);
        date.setDate(date.getDate() + i);
        const dateF = formatD(date);
        const item = {
          date: dateF,
          total: 0,
          showTotal: 0,
          count: 0,
          name: formatDate(date).split(",")[0],
        };
        dataByDate.push(item);
      }
    }

    console.log(dataByDate);
    console.log(data);

    data?.forEach((item) => {
      const index = dataByDate.findIndex((x) => x.date === item.check_in);
      if (index !== -1) {
        dataByDate[index].total += item.total;
        dataByDate[index].showTotal = moneyAdapter(
          dataByDate[index].total,
          typeMoney
        );
        dataByDate[index].count += 1;
      }
    });

    return dataByDate;
  };

  const handleGetDataChart = useCallback((startDate, endDate) => {
    const start = formatD(startDate);
    const end = formatD(endDate);
    const data = {
      start: start,
      end: end,
    };
    GetOrderByDate(data).then(async (res) => {
      if (res.status === 200) {
        const dataByDate = await handleFormatDate(
          res.data.data,
          startDate,
          endDate
        );
        setDataChart(dataByDate);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    handleGetDataChart(startDate, endDate);
  }, [endDate]);

  const handleOpenCalendar = () => {
    setOpenCalendar(!openCalendar);
  };

  const handleChooseType = (type) => {
    setTypeSelect(type);
  };

  const formatDate = (date) => {
    try {
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    } catch (error) {
      return "";
    }
  };

  const handleChooseDate = (date) => {
    const newDate = new Date(date);
    switch (typeSelect) {
      case "day":
        setValueDay(date);
        setStartDate(newDate);
        setEndDate(newDate);
        setTypeShow("Today:");
        setValueWeek();
        setValueMonth();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;
      case "week":
        setValueWeek(date);
        const startWeek = dayjs(date).startOf("week").toDate();
        const endWeek = dayjs(date).endOf("week").isAfter(dayjs())
          ? dayjs().toDate()
          : dayjs(date).endOf("week").toDate();
        setStartDate(startWeek);
        setEndDate(endWeek);
        setTypeShow("Week:");
        setValueDay();
        setValueMonth();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;

      case "month":
        setValueMonth(date);
        const today = new Date();
        const startMonth = dayjs(date).startOf("month").toDate();
        const endMonth = dayjs(date)
          .endOf("month")
          .isSame(dayjs(today).endOf("month"))
          ? today
          : dayjs(date).endOf("month").toDate();
        setStartDate(startMonth);
        setEndDate(endMonth);
        setTypeShow("Month:");
        setValueWeek();
        setValueDay();
        setValueCustom({
          startDate: "",
          endDate: "",
        });
        setOpenCalendar(false);
        break;
      case "custom":
        if (isFirstChoise.current) {
          setValueCustom({
            startDate: date,
            endDate: "",
          });
          isFirstChoise.current = false;
        } else {
          setValueCustom({
            startDate: valueCustom.startDate,
            endDate: date,
          });
          const startCustom = dayjs(valueCustom.startDate).toDate();
          const endCustom = dayjs(date).toDate();
          setStartDate(startCustom);
          setEndDate(endCustom);
          setOpenCalendar(false);
          setTypeShow("Custom:");
          setValueWeek();
          setValueMonth();
          setValueDay();
          isFirstChoise.current = true;
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className="revenue">
      <div className="container">
        <div className="overview">
          <div className="overview__title">
            <p>Overview</p>
            <div className="overview__title--header--date">
              <p>
                <span>(GMT+07:00)</span>
              </p>
              <div
                onClick={() => {
                  handleOpenCalendar();
                }}
                className={`overview__title__date ${
                  openCalendar ? "active" : ""
                }`}
              >
                <div className="overview__title__date--type">{typeShow}</div>
                <div className="overview__title__date--start">
                  {formatDate(startDate)}
                </div>
                <div className="overview__title__date--separate">-</div>
                <div className="overview__title__date--end">
                  {formatDate(endDate)}
                </div>
                <CalendarTodayIcon className="icon" />
              </div>
            </div>
            {openCalendar && (
              <div className="date-picker">
                <div className="date-picker__header">
                  <div
                    onClick={() => {
                      handleChooseType("day");
                    }}
                    className={`date-picker__header--title ${
                      typeSelect === "day" ? "active" : ""
                    }`}
                  >
                    Day
                  </div>
                  <div>|</div>
                  <div
                    onClick={() => {
                      handleChooseType("week");
                    }}
                    className={`date-picker__header--title ${
                      typeSelect === "week" ? "active" : ""
                    }`}
                  >
                    Week
                  </div>
                  <div>|</div>
                  <div
                    onClick={() => {
                      handleChooseType("month");
                    }}
                    className={`date-picker__header--title ${
                      typeSelect === "month" ? "active" : ""
                    }`}
                  >
                    Month
                  </div>
                  <div>|</div>
                  <div
                    onClick={() => {
                      handleChooseType("custom");
                    }}
                    className={`date-picker__header--title ${
                      typeSelect === "custom" ? "active" : ""
                    }`}
                  >
                    Custom
                  </div>
                </div>
                <div className="date-picker__content">
                  {typeSelect === "day" && (
                    <DateCalendar
                      value={valueDay}
                      onChange={(newValue) => {
                        handleChooseDate(newValue);
                      }}
                      disableFuture
                    />
                  )}
                  {typeSelect === "week" && (
                    <DateCalendar
                      value={valueWeek}
                      showDaysOutsideCurrentMonth
                      fixedWeekNumber={6}
                      onChange={(newValue) => {
                        handleChooseDate(newValue);
                      }}
                      slots={{ day: Day }}
                      slotProps={{
                        day: {
                          selectedDay: valueWeek,
                        },
                      }}
                      disableFuture
                    />
                  )}
                  {typeSelect === "month" && (
                    <MonthCalendar
                      value={valueMonth}
                      onChange={(newValue) => {
                        handleChooseDate(newValue);
                      }}
                      disableFuture
                    />
                  )}
                  {typeSelect === "custom" && (
                    <DateCalendar
                      showDaysOutsideCurrentMonth
                      fixedWeekNumber={6}
                      date={new Date()}
                      onChange={(newValue) => {
                        handleChooseDate(newValue);
                      }}
                      slots={{ day: Custom }}
                      slotProps={{
                        day: {
                          firstDay: valueCustom.startDate,
                          lastDay: valueCustom.endDate,
                        },
                      }}
                      disableFuture
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="overview__content">
            <div className="overview__content--header">
              <div className="overview__content--header--title">Revenue</div>
            </div>
            <div className="overview__content--chart">
              {loading ? (
                <></>
              ) : typeShow === "Today:" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={dataChart}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      fill="#8884d8"
                      barSize={30}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={300}
                    data={dataChart}
                    syncId="anyId"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
