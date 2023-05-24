import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAllOrders } from "../apiListBooking";
import Skeleton from "@mui/material/Skeleton";
import avatar from "../../../../assets/avatar.jpg";
import { OrderInputs } from "../../../Components/Input/InputOrder";
import "./bookingdetail.scss";
const BookingDetail = () => {
  const { bookingId } = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const initFetch = async () => {
    setIsLoading(true);
    const res = await GetAllOrders();
    if (res.status === 200) {
      const data = await res.data.data.filter((item) => item._id === bookingId);
      setData(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFetch();
  }, []);

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
  };

  return (
    <div className="bookingDetail">
      {isLoading ? (
        <div></div>
      ) : (
        <div className="container">
          <>
            <div className="top">
              <div className="left">
                <h1 className="title">Information</h1>
                <div className="item">
                  {data[0]?.id_user?.email ? (
                    <img src={avatar} alt="" className="itemImg" />
                  ) : (
                    <Skeleton variant="circular" className="itemImg" />
                  )}
                  <div className="details">
                    {data[0]?.id_user?.email ? (
                      <h1 className="itemTitle">{data[0].id_user?.name}</h1>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {data[0]?.id_user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">
                          {data[0].id_user?.email}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                    {data[0]?.id_user?.email ? (
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">
                          {data[0].id_user?.phone_number || "null"}
                        </span>
                      </div>
                    ) : (
                      <Skeleton variant="text" className="skeletonText dif" />
                    )}
                  </div>
                </div>
              </div>
              <div className="right">
                <form>
                  {OrderInputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        type="text"
                        id={input.id_input}
                        value={
                          input.id_input === "name"
                            ? data[0]?.id_room?.name
                            : input.id_input === "price"
                            ? data[0]?.id_room?.price
                            : input.id_input === "payment_method"
                            ? paymentAdapter(data[0]?.[input.id_input])
                            : data[0]?.[input.id_input]
                        }
                      />
                    </div>
                  ))}
                  {data[0]?.payment_method==="Pending" && 
                  <button className="buttonSave">Confirm</button>
                  }
                </form>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
