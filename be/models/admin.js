//create admin model for mongoose
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  idHotel: { type: String, default: null },
  dataHotel: { type: String },
  name: { type: String, default: null },
  phone_number: { type: String, default: null },
  email: { type: String, unique: true },
  roll: { type: String },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("admin", adminSchema);
