import React from "react";
import "./widgetroom.scss";

import { useDispatch } from "react-redux";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useSelector } from "react-redux";
import CustomLink from "../../../components/customlink/CustomLink";
import { setStateSidebar } from "../../../redux/Slices/Global";
const WidgetRoom = ({ type }) => {
  const { totalOrder, totalUser } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  let data;
  const diff = 20;

  const handleNavigate = (state) => {
    dispatch(setStateSidebar(state));
  };

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        amount: totalUser?.data?.users?.length,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
        state: "Users",
        to: "/users",
      };

      break;
    case "order":
      data = {
        title: "BOOKINGS",
        isMoney: false,
        link: "View all bookings",
        amount: totalOrder?.data?.length,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
        state: "Orders",
        to: "/bookings",
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: false,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "MY BALANCE",
        isMoney: false,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <CustomLink to={data.to}>
          <span
            className="link"
            onClick={() => {
              handleNavigate(data.state, data.path);
            }}
          >
            {data.link}
          </span>
        </CustomLink>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default WidgetRoom;
