const Room = require("../models/room");
const Hotel = require("../models/hotel");

const AddNewRoom = async (req, res) => {
  const {
    name,
    price,
    description,
    utility,
    image,
    isactive,
    hotel_id,
    tag,
  } = req.body;
  const room = new Room({
    name,
    price,
    description,
    image,
    utility,
    isactive,
    hotel_id,
    tag,
  });
  const hotel = await Hotel.find({ id: hotel_id });
  hotel[0].rooms.push(String(room._id));
  hotel[0].save();
  room.save();
  res.status(200).send(room);
};

const GetAllRooms = async (req, res) => {
  const rooms = await Room.find();
  res.status(200).send(rooms);
};

const GetRoomById = async (req, res) => {
  const room = Room.findById(req.params.id);
  res.status(200).send(room);
};

module.exports = { AddNewRoom, GetAllRooms, GetRoomById };
