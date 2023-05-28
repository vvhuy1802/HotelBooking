const Message = require("../models/message");

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
        time: msg.updatedAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { from, fromType, to, toType, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      senderType: fromType,
      receiver: to,
      receiverType: toType,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Message.findByIdAndDelete(id);
    if (data) return res.json({ msg: "Message deleted successfully." });
    else return res.json({ msg: "Failed to delete message from the database" });
  } catch (error) {
    next(ex);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const { id_sender } = req.body;
    const messages = await Message.find({ sender: id_sender }).populate(
      "receiver"
    );

    res.json(messages);
  } catch (ex) {
    next(ex);
  }
};

module.exports = { getMessages, addMessage, deleteMessage, getAllMessages };
