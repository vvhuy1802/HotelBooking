import "./app.scss";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { Home, Login, List, SingleUser, New } from "./pages";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
import Announce from "./components/announce/Announce";

import { GetAllOrders } from "./middlewares/order";
import { GetAllHotels } from "./middlewares/hotel";
import { GetAllUsers } from "./middlewares/user";
import { CheckLogin } from "./middlewares/auth";
import { GetAllAdmins } from "./middlewares/admin";

import {
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTotalAdmin,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
  defaultAnnouncement,
} from "./redux/Slices/Global";

import { getLocalStorage } from "./functions/asyncStorageFunctions";
import HomeHotel from "./ContainerAdminHotel/Container/Home/Home";
import SideBarHotel from "./ContainerAdminHotel/Components/SideBarHotel/SideBarHotel";
import NavBarHotel from "./ContainerAdminHotel/Components/NavBarHotel/NavBarHotel";
import ListRoom from "./ContainerAdminHotel/Container/ListRoom/ListRoom";
import ListBooking from "./ContainerAdminHotel/Container/ListBooking/ListBooking";
import RoomDetail from "./ContainerAdminHotel/Container/ListRoom/RoomDetail";

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
    GetAllAdmins().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalAdmin(res.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    getLocalStorage("token").then((res) => {
      if (res) {
        CheckLogin(res).then((res) => {
          if (res.status === 200) {
            dispatch(setUserInfo(res.data.data.admin));
            dispatch(setIsLoading(false));
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
            setTimeout(() => {
              dispatch(defaultAnnouncement());
            }, 3000);
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
        setTimeout(() => {
          dispatch(defaultAnnouncement());
        }, 3000);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const currentpath = location.pathname;
    if (currentpath === "/") {
      dispatch(setStateSidebar("Dashboard"));
    } else if (currentpath === "/users") {
      dispatch(setStateSidebar("Users"));
    } else if (currentpath === "/admins") {
      dispatch(setStateSidebar("Admin"));
    }
  }, [location.pathname, dispatch]);


  return (
    <div className="app">
      {isLoading ? (
        <></>
      ) : 
        userInfo.roll === "adminapp"?
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
                  </Route>

                  <Route path="admins">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="user">
                    <Route
                      path=":userId"
                      element={
                        userInfo ? <SingleUser /> : <Navigate to="/login/" />
                      }
                    />
                  </Route>

                  <Route path="hotels">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":hotelId"
                      element={
                        userInfo ? <SingleUser /> : <Navigate to="/login/" />
                      }
                    />
                    <Route
                      path="new"
                      element={userInfo ? <New /> : <Navigate to="/login/" />}
                    />
                  </Route>
                </Route>

                <Route
                  path="*"
                  element={
                    <h1>
                      <div className="notfound">
                        <div className="notfound-404">
                          <h1>404</h1>
                        </div>
                      </div>
                    </h1>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
        : 
      <>
        <div className="main">
            {userInfo && <SideBarHotel />}
            <div className="container">
              {userInfo && <NavBarHotel />}
              <Routes>
                <Route path="/">
                  <Route
                    path="/"
                    element={userInfo ? <HomeHotel /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="login"
                    element={userInfo ? <Navigate to="/" /> : <Login />}
                  />

                  <Route path="listroom">
                    <Route
                      index
                      element={userInfo ? <ListRoom /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="listroom/:id">
                    <Route
                      index
                      element={userInfo ? <RoomDetail/> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="listbooking">
                    <Route
                      index
                      element={userInfo ? <ListBooking /> : <Navigate to="/login" />}
                    />
                  </Route>

                  <Route path="user">
                    <Route
                      path=":userId"
                      element={
                        userInfo ? <SingleUser /> : <Navigate to="/login/" />
                      }
                    />
                  </Route>

                  <Route path="hotels">
                    <Route
                      index
                      element={userInfo ? <List /> : <Navigate to="/login" />}
                    />
                    <Route
                      path=":hotelId"
                      element={
                        userInfo ? <SingleUser /> : <Navigate to="/login/" />
                      }
                    />
                    <Route
                      path="new"
                      element={userInfo ? <New /> : <Navigate to="/login/" />}
                    />
                  </Route>
                </Route>

                <Route
                  path="*"
                  element={
                    <h1>
                      <div className="notfound">
                        <div className="notfound-404">
                          <h1>404</h1>
                        </div>
                      </div>
                    </h1>
                  }
                />
              </Routes>
            </div>
          </div>
      </>
    }
      <Announce />
    </div>
  );
}

export default App;
