const express = require("express");

const {
  AddNewRoom,
  GetAllRooms,
  GetRoomById,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/addnewroom", AddNewRoom);
router.get("/getallrooms", GetAllRooms);
router.get("/getroombyid/:id", GetRoomById);

module.exports = router;
