const express = require("express");

const {
  PushHotel,
  GetAllHotel,
  GetByID,
  FindHotelByActive,
  UpdateActive,
  AddIDRoom
} = require("../controllers/hotelController");

const router = express.Router();

router.post("/push", PushHotel);
router.get("/getall", GetAllHotel);
router.get("/getbyid/:id", GetByID);
router.get("/getbyactive", FindHotelByActive);
router.put("/updateactive/:id", UpdateActive);
router.put("/addidroom", AddIDRoom);

module.exports = router;
