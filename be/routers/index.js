const AuthRoute = require("./auth");
const HotelRoute = require("./hotels");
const RoomRoute = require("./rooms");
const CommentRoute = require("./comments");
function router(app) {
  app.use("/auth", AuthRoute);
  app.use("/hotels", HotelRoute);
  app.use("/rooms", RoomRoute);
  app.use("/comments", CommentRoute);
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
}

module.exports = router;
