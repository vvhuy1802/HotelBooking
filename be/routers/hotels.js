const express = require("express");

const { Push, GetAllHotel,GetByID,FindHotelByActive,UpdateActive } = require("../controllers/hotelController");

const router = express.Router();

router.post("/push", Push);
router.get("/getall", GetAllHotel);
router.get("/getbyid/:id", GetByID);
router.get("/getbyactive", FindHotelByActive);
router.put("/updateactive/:id", UpdateActive);

module.exports = router;
