import { useEffect, useState } from "react";
import "./listvehicle.scss";
import { useSelector } from "react-redux";
import DataTable from "../../Components/DataTable/DataTable";
import { getAllVehicleInHotel } from "./apiListVehicle";

const ListVehicle = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const initFetch = async () => {
    setIsLoading(true);
    const res = await getAllVehicleInHotel();
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

  useEffect(() => {
    if(reload){
      initFetch();
      setReload(false)
    }
  }, [reload]);
  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <div className="list">
          <div className="listContainer">
            <DataTable data={data} setReload={setReload}/>
          </div>
        </div>
      )}
    </>
  );
};

export default ListVehicle;
