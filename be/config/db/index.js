const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/hotel_booking", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Hotel Booking Database"))
    .catch((err) => console.log(err));
};

module.exports = { connect };
