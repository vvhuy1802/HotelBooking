const Hotel = require("../models/hotel");
const Comments = require("../models/comment");
const AddNewHotel = (req, res) => {
  const {
    id,
    name,
    advantage,
    comments,
    description,
    image,
    rooms,
    isactive,
    address,
    position,
    tag,
  } = req.body;
  const hotel = new Hotel({
    id,
    name,
    advantage,
    comments,
    description,
    image,
    rooms,
    isactive,
    address,
    position,
    tag,
  });
  hotel.save();
  res.status(200).send("Pushed to database");
};

const GetAllHotel = async (req, res) => {
  var hotels = await Hotel.find()
    .populate("rooms")
    .populate("comments")

  hotels = await Comments.populate(hotels, { path: "comments.id_user", select: "name" });
  hotels = await Comments.populate(hotels, { path: "comments.id_room", select: "name" });
  res.status(200).send(hotels);
};

const GetByID = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.status(200).send(hotel);
};

const FindHotelByActive = async (req, res) => {
  const hotel = await Hotel.find({ isactive: false });
  res.status(200).send(hotel);
};

const UpdateActive = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  hotel.isactive = !hotel.isactive;
  hotel.save();
  res.status(200).send(hotel);
};

const AddIDRoom = async (req, res) => {
  const hotel = await Hotel.find({ id: req.body.id });
  hotel[0].rooms.push(req.body.rooms);
  hotel[0].save();
  res.status(200).send(hotel);
};

module.exports = {
  AddNewHotel,
  GetAllHotel,
  GetByID,
  FindHotelByActive,
  UpdateActive,
  AddIDRoom,
};
