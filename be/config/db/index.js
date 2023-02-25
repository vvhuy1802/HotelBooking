const mongoose = require("mongoose");
// 7D8SsMgQbeLCDCms
mongoose.set('strictQuery', true)
async function connect() {
  try {
    mongoose
      .connect(
        "mongodb+srv://vuhuy:7D8SsMgQbeLCDCms@hotel-booking.gujng51.mongodb.net/hotel_booking?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.log(err));
  } catch (err) {
    console.error(err);
  }
}

module.exports = { connect };
