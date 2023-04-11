import React from "react";
import "./sidebar.scss";
import { useSelector, useDispatch } from "react-redux";
import { setStateSidebar } from "../../redux/Slices/Global";
import CustomLink from "../customlink/CustomLink";

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
  const dispatch = useDispatch();
  const { stateSidebar } = useSelector((state) => state.global);

  const setActive = (name) => {
    dispatch(setStateSidebar(name));
  };

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Admin</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <CustomLink to="/">
            <li
              className={stateSidebar === "Dashboard" ? "onUse" : ""}
              onClick={() => {
                setActive("Dashboard");
              }}
            >
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </CustomLink>
          <p className="title">LIST</p>
          <CustomLink to="users">
            <li
              className={stateSidebar === "Users" ? "onUse" : ""}
              onClick={() => {
                setActive("Users");
              }}
            >
              <PeopleOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </CustomLink>
          <li
            className={stateSidebar === "Admin" ? "onUse" : ""}
            onClick={() => {
              setActive("Admin");
            }}
          >
            <AdminPanelSettingsOutlinedIcon className="icon" />
            <span>Admin Hotels</span>
          </li>
          <li
            className={stateSidebar === "Hotels" ? "onUse" : ""}
            onClick={() => {
              setActive("Hotels");
            }}
          >
            <ApartmentOutlinedIcon className="icon" />
            <span>Hotels</span>
          </li>
          <li
            className={stateSidebar === "Orders" ? "onUse" : ""}
            onClick={() => {
              setActive("Orders");
            }}
          >
            <ViewListOutlinedIcon className="icon" />
            <span>Orders</span>
          </li>
          <p className="title">SERVICE</p>
          <li
            className={stateSidebar === "Notifications" ? "onUse" : ""}
            onClick={() => {
              setActive("Notifications");
            }}
          >
            <NotificationsNoneOutlinedIcon className="icon" />
            <span>Notifications</span>
          </li>
          <li
            className={stateSidebar === "Settings" ? "onUse" : ""}
            onClick={() => {
              setActive("Settings");
            }}
          >
            <SettingsOutlinedIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">ACCOUNT</p>
          <li
            className={stateSidebar === "Profile" ? "onUse" : ""}
            onClick={() => {
              setActive("Profile");
            }}
          >
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li
            className={stateSidebar === "Log" ? "onUse" : ""}
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
