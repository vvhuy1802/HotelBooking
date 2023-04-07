import React, { useState } from "react";
import "./sidebar.scss";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SideBar = () => {
  const [active, setActive] = useState("Dashboard");
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Admin</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li
            className={active === "Dashboard" ? "onUse" : ""}
            onClick={() => {
              setActive("Dashboard");
            }}
          >
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LIST</p>
          <li
            className={active === "Users" ? "onUse" : ""}
            onClick={() => {
              setActive("Users");
            }}
          >
            <PeopleOutlinedIcon className="icon" />
            <span>Users</span>
          </li>
          <li
            className={active === "Admin" ? "onUse" : ""}
            onClick={() => {
              setActive("Admin");
            }}
          >
            <AdminPanelSettingsOutlinedIcon className="icon" />
            <span>Admin Hotels</span>
          </li>
          <li
            className={active === "Hotels" ? "onUse" : ""}
            onClick={() => {
              setActive("Hotels");
            }}
          >
            <ApartmentOutlinedIcon className="icon" />
            <span>Hotels</span>
          </li>
          <li
            className={active === "Orders" ? "onUse" : ""}
            onClick={() => {
              setActive("Orders");
            }}
          >
            <ViewListOutlinedIcon className="icon" />
            <span>Orders</span>
          </li>
          <p className="title">SERVICE</p>
          <li
            className={active === "Notifications" ? "onUse" : ""}
            onClick={() => {
              setActive("Notifications");
            }}
          >
            <NotificationsNoneOutlinedIcon className="icon" />
            <span>Notifications</span>
          </li>
          <li
            className={active === "Settings" ? "onUse" : ""}
            onClick={() => {
              setActive("Settings");
            }}
          >
            <SettingsOutlinedIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">ACCOUNT</p>
          <li
            className={active === "Profile" ? "onUse" : ""}
            onClick={() => {
              setActive("Profile");
            }}
          >
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li
            className={active === "Log" ? "onUse" : ""}
            onClick={() => {
              setActive("Log");
            }}
          >
            <LogoutOutlinedIcon className="icon" />
            <span>Log out</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  );
};

export default SideBar;
