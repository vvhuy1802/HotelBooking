const AuthRoute = require("./auth");
const HotelRoute = require("./hotels");
function router(app) {
  app.use("/auth", AuthRoute);
  app.use("/hotels", HotelRoute);
  app.get("/", (req, res) => {
    res.send("Đjtmemay thăng wjbu rách");
  });
}

module.exports = router;
