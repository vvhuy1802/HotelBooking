const express = require("express");
const auth = require("../middleware/auth");

const {
  Register,
  Login,
  Logout,
  CheckLogin,
  UpdateProfile,
  ChangePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/checkLogin", auth, CheckLogin);
router.post("/updateProfile", UpdateProfile);
router.post("/changePassword", ChangePassword);
router.get("/logout", Logout);

module.exports = router;
