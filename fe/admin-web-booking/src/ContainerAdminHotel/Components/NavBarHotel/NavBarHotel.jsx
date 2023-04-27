import React from "react";
import "./navbarhotel.scss";
import avatar from "../../../assets/avatar.jpg";
import { useSelector } from "react-redux";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

const NavBarHotel = () => {
  const { userInfo } = useSelector((state) => state.global);

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          Hello, <span className="name">{userInfo.name}</span>
        </div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            <span>English</span>
          </div>
          <div className="item">
            <DarkModeOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img src={avatar} alt="" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarHotel;
