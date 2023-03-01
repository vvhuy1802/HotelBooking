const express = require("express");

const { PushRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/push", PushRoom);

module.exports = router;
