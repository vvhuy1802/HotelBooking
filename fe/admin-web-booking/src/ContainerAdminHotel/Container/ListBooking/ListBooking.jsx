import { useEffect, useState } from "react";
import DataRoom from "../../Components/DataRoom/DataRoom";
import "./listbooking.scss";
import { GetAllOrders } from "./apiListBooking";
import { useSelector } from "react-redux";
import DataBooking from "../../Components/DataBooking/DataBooking";

const ListBooking = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const initFetch = async () => {
    setIsLoading(true);
    const res = await GetAllOrders();
    if (res.status === 200) {
      const data = res.data.data.filter(
        (item) => item.id_hotel === userInfo.idHotel
      );
      setData(data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initFetch();
  }, []);
  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <div className="list">
          <div className="listContainer">
            <DataBooking data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default ListBooking;
