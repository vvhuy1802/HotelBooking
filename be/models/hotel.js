const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  id: { type: String, default: null },
  name: { type: String, default: null },
  advantage: { type: String, default: null },
  comments: { type: Array, default: [] },
  description: { type: String, default: null },
  id_room: { type: Array, default: [] },
  image: { type: String, default: null },
  isactive: { type: Boolean, default: true },
  address: { type: String, default: null },
  position: { type: Array, default: [] },
  tag: { type: String, default: null },
});

module.exports = mongoose.model("hotel", hotelSchema);
