const express = require("express");
const auth = require("../middleware/auth");

const {
  Register,
  Login,
  checkLogin,
  GetAllAdmin,
  GetAdminById,
  GetAdminByIdHotel,
  UpdateInfoAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/checkLogin", auth, checkLogin);

router.get("/getall", GetAllAdmin);
router.get("/:id", GetAdminById);
router.get("/hotel/:id", GetAdminByIdHotel);

router.put("/update/:id", UpdateInfoAdmin);

module.exports = router;
