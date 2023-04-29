import { useEffect, useState } from "react";
import "./listroom.scss";
import { getAllRoomInHotel } from "./apiListRoom";
import { useSelector } from "react-redux";
import DataTable from "../../Components/DataTable/DataTable";

const ListRoom = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const initFetch = async () => {
    setIsLoading(true);
    const res = await getAllRoomInHotel();
    if (res.status === 200) {
      const data = res.data.filter(
        (item) => item.hotel_id === userInfo.idHotel
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
            <DataTable data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default ListRoom;
