const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  id: { type: String, default: null },
  name: { type: String, default: null },
  advantage: { type: String, default: null },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  description: { type: String, default: null },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }],
  image: { type: String, default: null },
  isactive: { type: Boolean, default: true },
  address: { type: String, default: null },
  position: { type: Array, default: [] },
  tag: { type: String, default: null },
});

module.exports = mongoose.model("hotel", hotelSchema);
