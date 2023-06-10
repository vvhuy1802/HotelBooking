const Order = require("../models/order");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const AddNewOrder = async (req, res) => {
  const {
    id_user,
    id_hotel,
    id_room,
    id_vehicle,
    check_in,
    check_out,
    total,
    payment_method,
    paymented,
    status,
    created_at,
    updated_at,
  } = req.body;
  const newOrder = new Order({
    id_user,
    id_hotel,
    id_room,
    id_vehicle,
    check_in,
    check_out,
    total,
    payment_method,
    paymented,
    status,
    created_at,
    updated_at,
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
    const orders = await Order.find()
      .populate("id_user", "name email phone_number type tokenNotification")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdHotel = async (req, res) => {
  try {
    const orders = await Order.find({ id_hotel: req.params.id_hotel })
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderByIdUser = async (req, res) => {
  try {
    const orders = await Order.find({ id_user: req.params.id })
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("id_user")
      .populate("id_room")
      .populate("id_vehicle");
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateOrder = async (req, res) => {
  try {
    const {
      id_user,
      id_room,
      id_hotel,
      id_vehicle,
      check_in,
      check_out,
      total,
      status,
    } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        id_user,
        id_room,
        id_hotel,
        id_vehicle,
        check_in,
        check_out,
        total,
        status,
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

const UpdateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save();
    res.status(200).json({ success: true, data: order });
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
const GetOrderByDate = async (req, res) => {
  const { start, end } = req.body;
  try {
    const start1 = new Date(start);
    const end1 = new Date(end);
    const startDate = new Date(start1.toISOString().split("T")[0]);
    const endDate = new Date(end1.toISOString().split("T")[0]);
    const orders = await Order.find();

    const data = [];

    orders.forEach((order) => {
      const check_in1 = new Date(order.check_in);
      const check_inDate = new Date(check_in1.toISOString().split("T")[0]);
      if (
        check_inDate >= startDate &&
        check_inDate <= endDate &&
        order.paymented
      ) {
        data.push(order);
      }
    });

    return res.status(200).json({ success: true, data: data });
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
  UpdateStatus,
  GetOrderByDate,
};
