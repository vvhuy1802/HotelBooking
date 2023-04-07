import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Home, Login, List, Single, New } from "./pages";

import { GetAllOrders } from "./middlewares/order";
import { GetAllHotels } from "./middlewares/hotel";
import { GetAllUsers } from "./middlewares/auth";
import {
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
} from "./redux/Slices/Global";

function App() {
  const dispatch = useDispatch();
  const [loading] = useState(true);

  useEffect(() => {
    GetAllHotels().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalHotel(res.data));
        console.log("All Hotels Getted");
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllOrders().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalOrder(res.data));
        console.log("All Orders Getted");
      }
    });
  }, [dispatch]);

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (res.status === 200) {
        dispatch(setTotalUser(res.data));
        console.log("All Users Getted");
      }
    });
  }, [dispatch]);

  return (
    <div className="">
      {loading ? (
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />

            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route path="new" element={<New />} />
            </Route>

            <Route path="products">
              <Route index element={<List />} />
              <Route path=":productId" element={<Single />} />
              <Route path="new" element={<New />} />
            </Route>
          </Route>
        </Routes>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default App;
