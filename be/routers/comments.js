const express = require("express");
const checkComment = require("../middleware/checkcondition");
const {
  AddNewComment,
  GetAllComment,
} = require("../controllers/commentController");

const router = express.Router();

router.post("/addnewcomment", AddNewComment);
router.get("/getallcomments", GetAllComment);

module.exports = router;
