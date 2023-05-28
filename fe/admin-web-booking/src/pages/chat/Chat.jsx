import React, { useState, useEffect, useRef } from "react";
import "./chat.scss";
import { useSelector } from "react-redux";
import { LOCAL_API_URL } from "../../api";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { SendMessage, RecieveMessage } from "../../middlewares/message";

function Chat() {
  const { userInfo, totalHotel } = useSelector((state) => state.global);
  const [currentUser, setCurrentUser] = useState(
    userInfo.roll === "adminapp"
      ? "6442aa5167b30af877e4ee71"
      : totalHotel?.filter((item) => item.id === userInfo?.idHotel)[0]?._id
  );
  const socket = useRef();
  const scrollRef = useRef();
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");
  const [sentTo, setSentTo] = useState("640aca4c8df7f8a1209eebc4");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    if (userInfo.roll === "adminapp") {
      setCurrentUser("6442aa5167b30af877e4ee71");
    } else {
      setCurrentUser(
        totalHotel?.filter((item) => item.id === userInfo?.idHotel)[0]?._id
      );
    }
  }, [userInfo, totalHotel]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(LOCAL_API_URL);
      socket.current.emit("add-user", currentUser);
      console.log("connected");
    }
  }, [currentUser]);

  useEffect(() => {
    const getMsg = async () => {
      const data = {
        from: currentUser,
        to: sentTo,
      };
      const response = await RecieveMessage(data);
      if (response.status === 200) {
        setMessages(response.data);
      }
    };
    getMsg();
  }, [currentUser]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: sentTo,
      from: currentUser,
      msg,
    });

    const msgs = Array.isArray(messages) ? [...messages] : [];
    msgs.push({
      fromSelf: false,
      message: {
        text: msg,
      },
    });
    setMessages(msgs);

    const data = {
      from: currentUser,
      fromType: userInfo.roll === "adminapp" ? "admin" : "hotel",
      to: sentTo,
      toType: "user",
      message: msg,
    };

    await SendMessage(data);
  };

  useEffect(() => {
    if (socket.current) {
      console.log("listening");
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: {
            text: msg,
          },
        });
      });
    } else {
      console.log("no socket");
    }
  }, [currentUser]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container">
      <h1
        onClick={() => {
          setMessages([]);
        }}
      >
        Chat in {currentUser} Screen
      </h1>
      {messages?.map((message) => {
        return (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content ">
                <p>{message.message.text}</p>
              </div>
            </div>
          </div>
        );
      })}
      <input value={input} onChange={(event) => setInput(event.target.value)} />
      <button
        onClick={() => {
          handleSendMsg(input);
          setInput("");
        }}
      >
        Send Message
      </button>
    </div>
  );
}

export default Chat;
