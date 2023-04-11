import "./app.scss";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { Home, Login, List, Single, New } from "./pages";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
import Announce from "./components/announce/Announce";

import { GetAllOrders } from "./middlewares/order";
import { GetAllHotels } from "./middlewares/hotel";
import { GetAllUsers } from "./middlewares/user";
import { CheckLogin } from "./middlewares/auth";

import {
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
} from "./redux/Slices/Global";

import { getLocalStorage } from "./functions/asyncStorageFunctions";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, isLoading } = useSelector((state) => state.global);

  useEffect(() => {
    GetAllHotels().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalHotel(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllOrders().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalOrder(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalUser(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getLocalStorage("token").then((res) => {
      if (res) {
        CheckLogin(res).then((res) => {
          if (res.status === 200) {
            dispatch(setUserInfo(res.data.data.user));
            dispatch(setIsLoading(false));
            dispatch(
              setAnnouncement({
                message: "Welcome back!",
                type: "success",
                id: Math.random(),
              })
            );
          } else {
            dispatch(setUserInfo(""));
            dispatch(setIsLoading(false));
            dispatch(
              setAnnouncement({
                message: "Please login to continue!",
                type: "error",
                id: Math.random(),
              })
            );
          }
        });
      } else {
        dispatch(setUserInfo(""));
        dispatch(setIsLoading(false));
        dispatch(
          setAnnouncement({
            message: "Please login to continue!",
            type: "error",
            id: Math.random(),
          })
        );
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const currentpath = location.pathname;
    if (currentpath === "/") {
      dispatch(setStateSidebar("Dashboard"));
    } else if (currentpath === "/users") {
      dispatch(setStateSidebar("Users"));
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      ) : (
        <>
          <div className="main">
            {userInfo && <SideBar />}
            <div className="container">
              {userInfo && <NavBar />}
              <Routes>
                <Route path="/">
                  <Route
                    path="/"
                    element={userInfo ? <Home /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="login"
                    element={userInfo ? <Navigate to="/" /> : <Login />}
                  />
                  <Route path="users">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":userId"
                      element={
                        userInfo ? <Single /> : <Navigate to="/login/" />
                      }
                    />
                    <Route
                      path="new"
                      element={userInfo ? <New /> : <Navigate to="/login/" />}
                    />
                  </Route>

                  <Route path="products">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":productId"
                      element={
                        userInfo ? <Single /> : <Navigate to="/login/" />
                      }
                    />
                    <Route
                      path="new"
                      element={userInfo ? <New /> : <Navigate to="/login/" />}
                    />
                  </Route>
                </Route>
              </Routes>
            </div>
          </div>
        </>
      )}
      <Announce />
    </div>
  );
}

export default App;
