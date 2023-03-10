//create user model for mongoose
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  phone_number: { type: String, default: null },
  email: { type: String, unique: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
