const Room = require("../models/room");
const {AddIDRoom} = require("./hotelController");
const PushRoom = (req, res) => {
  const {
    id,
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
    id,
    name,
    price,
    description,
    image,
    utility,
    isactive,
    hotel_id,
    tag,
  });
  room.save();
  res.status(200).send("Pushed room to database");
};

module.exports = { PushRoom };
