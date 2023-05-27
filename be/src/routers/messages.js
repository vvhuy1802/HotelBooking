const express = require("express");

const {
  getMessages,
  addMessage,
  deleteMessage,
  getAllMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/getmsg/", getMessages);
router.post("/sendmsg/", addMessage);
router.post("/getallmsg", getAllMessages);
router.post("/deletemsg/:id", deleteMessage);

module.exports = router;
