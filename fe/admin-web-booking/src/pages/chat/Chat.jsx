import React, { useState, useEffect, useRef } from "react";
import "./chat.scss";
import { useSelector } from "react-redux";
import { LOCAL_API_URL } from "../../api";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { SendMessage, RecieveMessage } from "../../middlewares/message";

function Chat() {
  const { userInfo } = useSelector((state) => state.global);
  const [currentUser, setCurrentUser] = useState(userInfo);
  const socket = useRef();
  const scrollRef = useRef();
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");
  const [sentTo, setSentTo] = useState("640aca4c8df7f8a1209eebc4");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(LOCAL_API_URL);
      socket.current.emit("add-user", "63fffb95a667eff7c6da2d89");
    }
  }, [currentUser]);

  useEffect(() => {
    const getMsg = async () => {
      const data = {
        from: "63fffb95a667eff7c6da2d89",
        to: sentTo,
      };
      const response = await RecieveMessage(data);
      if (response.status === 200) {
        setMessages(response.data);
      }
    };
    getMsg();
  }, []);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: sentTo,
      from: "63fffb95a667eff7c6da2d89",
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
      from: "63fffb95a667eff7c6da2d89",
      fromType: "hotel",
      to: sentTo,
      toType: "user",
      message: msg,
    };

    await SendMessage(data);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: {
            text: msg,
          },
        });
      });
    }
  }, []);

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
        Chat in {currentUser?._id} Screen
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
