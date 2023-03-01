const AuthRoute = require("./auth");
const HotelRoute = require("./hotels");
const RoomRoute = require("./rooms");
function router(app) {
  app.use("/auth", AuthRoute);
  app.use("/hotels", HotelRoute);
  app.use("/rooms", RoomRoute);
  app.get("/", (req, res) => {
    res.send("Đjtmemay thăng wjbu rách");
  });
}

module.exports = router;
