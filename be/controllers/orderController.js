const Order = require("../models/order");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const AddNewOrder = async (req, res) => {
  const {
    id_user,
    id_hotel,
    id_room,
    check_in,
    check_out,
    total,
    payment_method,
  } = req.body;
  const newOrder = new Order({
    id_user,
    id_hotel,
    id_room,
    check_in,
    check_out,
    total,
    payment_method,
  });
  try {
    const order = await newOrder.save();
    const user = await User.findById(id_user);
    user.orders.push(order._id);
    await user.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("id_user").populate("id_room");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdHotel = async (req, res) => {
  try {
    const orders = await Order.find({ id_hotel: req.params.id_hotel })
      .populate("id_user")
      .populate("id_room");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdUser = async (req, res) => {};

const GetOrderById = async (req, res) => {};

const UpdateOrder = async (req, res) => {
  try {
    const {
      id_user,
      id_room,
      id_hotel,
      checkin,
      checkout,
      total,
      status,
      number_person,
    } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        id_user,
        id_room,
        id_hotel,
        checkin,
        checkout,
        total,
        status,
        number_person,
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Delete order success" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateReview = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.reviewed = true;
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  AddNewOrder,
  GetAllOrders,
  GetOrderByIdHotel,
  GetOrderByIdUser,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
  UpdateReview,
};
