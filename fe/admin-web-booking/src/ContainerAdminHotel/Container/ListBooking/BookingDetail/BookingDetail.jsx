import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetAllOrders } from "../apiListBooking";
import Skeleton from "@mui/material/Skeleton";
import avatar from "../../../../assets/avatar.jpg";
import { OrderInputs } from "../../../Components/Input/InputOrder";
import "./bookingdetail.scss";
import Loading from "../../../Components/Loading/Loading";
import { updateStatusInOrder } from "../../../Components/DataTable/apiDataTable";
const BookingDetail = () => {
  const navigate = useNavigate();
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

  const ConfirmBooking = async () => {
      const res = await updateStatusInOrder(bookingId,"Completed");
      if (res.status===200){
        navigate("/listbooking")
      }
  }

  const CancelBooking = async () => {
      const res = await updateStatusInOrder(bookingId,"Cancelled");
      if(res.status===200){
        navigate("/listbooking")
      }
    }

  useEffect(() => {
    initFetch();
  }, []);

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
    else if (method==="payment-zalopay"){
      return "Payment ZaloPay";
    }
  };

  return (
    <>
          {isLoading ? (
        <Loading/>
      ) : (
    <div className="bookingDetail">
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
                  {data[0]?.status==="Pending" && 
                  <button onClick={ConfirmBooking} className="buttonSave">Confirm</button>
                  }
                  {data[0]?.status==="Pending" && 
                  <button onClick={CancelBooking} className="buttonCancel">Cancel</button>
                  }
                </form>
              </div>
            </div>
          </>
        </div>
    </div>
     )}
      </>
  );
};

export default BookingDetail;
