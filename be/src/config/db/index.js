const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const config = process.env;

async function connect() {
  var checkIndex = false;
  try {
    await mongoose
      .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connect to database successfully");
        checkIndex = true;
      })
      .catch((error) => {
        console.log("Connect to database failed, retrying...");
        setTimeout(connect, 5000);
      });
    if (checkIndex) {
      const collection = mongoose.connection.collection("admins");
      collection.dropIndex("adminks", function (err, result) {
        if (err) {
          // console.log("Error in dropping index!");
        } else {
          console.log("Index dropped successfully!");
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
