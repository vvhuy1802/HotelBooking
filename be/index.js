const express = require("express");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
require("dotenv").config();
const config = process.env;

const db = require("./src/config/db");
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

async function StartApp() {
  const router = require("./src/routers/index");
  router(app);

  //get ipv4 and update at be and fe
  const api = require("./src/config/api");
  const ipv4 = await api.UpdateAPI_URL();

  const server = app.listen(config.PORT, ipv4, () => {
    console.log(`Server started at http://${ipv4}:${config.PORT}`);
  });

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
}

StartApp();
