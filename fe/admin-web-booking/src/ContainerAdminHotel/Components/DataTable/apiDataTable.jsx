import { DELETE, PUT } from "../../../functions/fetchToBE";


export const DeleteRoomInHotel = (id) => {
        const res = DELETE(`/rooms/deleteroom/${id}`);
}

export const updateStatusInOrder= (id,status) =>{
        const res = PUT(`/orders/status/${id}`,{
                status: status,
        });
}