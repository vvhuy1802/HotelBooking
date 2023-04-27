import { useLocation } from "react-router-dom";



const RoomDetail = () => {
        const location = useLocation();
        const { state } = location;
        console.log(state);
        return (
          <div>

          </div>    
        )
}

export default RoomDetail