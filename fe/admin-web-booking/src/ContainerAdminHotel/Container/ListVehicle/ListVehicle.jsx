import { useEffect, useState } from "react";
import "./listvehicle.scss";
import { useSelector } from "react-redux";
import DataTable from "../../Components/DataTable/DataTable";
import { getVehicleById } from "./apiListVehicle";
import { Link, useLocation } from "react-router-dom";


const ListVehicle = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  const location = useLocation();
  const initFetch = async () => {
    setIsLoading(true);
    const res = await getVehicleById(userInfo.idHotel);
    if (res.status === 200) {
      setData(res.data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initFetch();
  }, [location]);

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
            {data.length> 0?
            <DataTable data={data} setReload={setReload}/>
            :
            <>
            <Link
              to={"/listvehicle/new"}
              style={{ textDecoration: "none" }}
              className="link"
            >
              Add new
            </Link>
            <div className="noData">Không có dữ liệu</div>
            </>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default ListVehicle;
