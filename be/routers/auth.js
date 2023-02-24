const express = require("express");
const auth = require("../middleware/auth");

const {
    Register,
    Login,
    Logout,
    CheckLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/CheckLogin", auth, CheckLogin);
router.get("/logout", Logout);

module.exports = router;