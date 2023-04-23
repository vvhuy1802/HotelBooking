import "./singleuser.scss";
import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpg";
import Skeleton from "@mui/material/Skeleton";

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleUser } from "../../middlewares/user";
import { setStateSidebar } from "../../redux/Slices/Global";
import Chart from "../../components/chart/Chart";
import ListTable from "../../components/table/Table";

const SingleUser = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath = location.pathname;
  const [user, setUser] = useState({});
  const { typeMoney } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(setStateSidebar("Users"));
    GetSingleUser(currentPath.split("/")[2]).then((res) => {
      setUser(res.data.data.user);
      console.log(res.data.data.user);
    });
  }, [dispatch, currentPath]);

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

  const totalSpending = () => {
    var total = 0;
    user.orders?.forEach((order) => {
      total += order.total;
    });
    return moneyAdapter(total, typeMoney);
  };

  return (
    <div className="single-user">
      <div className="container">
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            <div className="item">
              {user.email ? (
                <img src={avatar} alt="" className="itemImg" />
              ) : (
                <Skeleton variant="circular" className="itemImg" />
              )}
              <div className="details">
                {user.email ? (
                  <h1 className="itemTitle">{user.name}</h1>
                ) : (
                  <Skeleton variant="text" className="skeletonText dif" />
                )}
                {user.email ? (
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{user.email}</span>
                  </div>
                ) : (
                  <Skeleton variant="text" className="skeletonText dif" />
                )}
                {user.email ? (
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">
                      {user.phone_number || "null"}
                    </span>
                  </div>
                ) : (
                  <Skeleton variant="text" className="skeletonText dif" />
                )}
              </div>
            </div>
            <div className="booking">
              {user.email ? (
                <div className="bookingItem">
                  <span className="itemKey">Total Orders:</span>
                  <span className="itemValue">{user.orders?.length}</span>
                </div>
              ) : (
                <Skeleton variant="text" className="skeletonText" />
              )}
              {user.email ? (
                <div className="bookingItem">
                  <span className="itemKey">Total Spending:</span>
                  <span className="itemValue">{totalSpending()}</span>
                </div>
              ) : (
                <Skeleton variant="text" className="skeletonText" />
              )}
            </div>
          </div>
          <div className="right">
            <Chart
              dataChart={user.orders}
              height={200}
              title={"User Spending (Last 6 Months)"}
            />
          </div>
        </div>
        <div className="bottom">
          <div className="listContainer">
            <div className="listTitle">Last Transactions</div>
            <ListTable dataTable={user.orders} userName={user.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
