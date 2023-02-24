const Hotel = require("../models/hotel");

const Push = (req, res) => {
  const {
    id,
    name,
    advantage,
    comments,
    description,
    image,
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
    isactive,
    address,
    position,
    tag,
  });
  hotel.save();
  res.status(200).send("Pushed to database");
};

const GetAllHotel = async (req, res) => {
  const hotels = await Hotel.find();
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
}

module.exports = {
  Push,
  GetAllHotel,
  GetByID,
  FindHotelByActive,
  UpdateActive
};
