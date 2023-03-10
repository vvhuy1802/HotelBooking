const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  id_room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
  id_hotel: { type: String, default: "" },
  checkin: { type: Date, default: Date.now },
  checkout: { type: Date, default: Date.now },
  total: { type: Number, default: 0 },
  status: { type: String, default: "Pending" },
  number_person: { type: Number, default: 0 },
  reviewed: { type: Boolean, default: false },
});

module.exports = mongoose.model("order", orderSchema);
