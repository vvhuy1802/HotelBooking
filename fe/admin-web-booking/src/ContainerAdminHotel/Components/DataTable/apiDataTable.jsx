import { DELETE } from "../../../functions/fetchToBE";


export const DeleteRoomInHotel = (id) => {
        const res = DELETE(`/rooms/deleteroom/${id}`);
}