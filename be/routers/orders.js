const express = require("express");

const {
  AddNewOrder,
  GetAllOrders,
  GetOrderByIdHotel,
  GetOrderByIdUser,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
  UpdateReview,
  UpdateStatus
} = require("../controllers/orderController");

const router = express.Router();

router.post("/addneworder", AddNewOrder);
router.get("/getallorders", GetAllOrders);
router.get("/hotel/:id_hotel", GetOrderByIdHotel);
router.get("/user/:id", GetOrderByIdUser);
router.get("/:id", GetOrderById);
router.put("/update/:id", UpdateOrder);
router.delete("/delete/:id", DeleteOrder);
router.put("/reviewd/:id", UpdateReview);
router.put("/status/:id", UpdateStatus);

module.exports = router;
