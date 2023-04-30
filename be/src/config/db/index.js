const mongoose = require("mongoose");
// 7D8SsMgQbeLCDCms
mongoose.set("strictQuery", true);
const MONGODB_URI =
  "mongodb+srv://vuhuy:7D8SsMgQbeLCDCms@hotel-booking.gujng51.mongodb.net/hotel_booking?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connect to database successfully");
      })
      .catch((error) => {
        console.log("Connect to database failed, retrying...");
        setTimeout(connect, 5000);
      });
    const collection = mongoose.connection.collection("admins");
    collection.dropIndex("adminks", function (err, result) {
      if (err) {
        console.log("Error in dropping index!");
      } else {
        console.log("Index dropped successfully!");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
