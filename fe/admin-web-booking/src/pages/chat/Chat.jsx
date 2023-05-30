import React, { useState, useEffect, useRef, useCallback } from "react";
import "./chat.scss";
import { useSelector } from "react-redux";
import { LOCAL_API_URL } from "../../api";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import moment from "moment/moment";
import {
  SendMessage,
  RecieveMessage,
  GetListUser,
} from "../../middlewares/message";
import { GetSingleUser } from "../../middlewares/user";
import avatar from "../../assets/avatar.jpg";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import { useLocation } from "react-router-dom";

function Chat() {
  const { userInfo, totalHotel } = useSelector((state) => state.global);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(
    userInfo.roll === "adminapp"
      ? "6442aa5167b30af877e4ee71"
      : totalHotel?.filter((item) => item.id === userInfo?.idHotel)[0]?._id
  );
  const socket = useRef();
  const scrollRef = useRef();
  const scrollChatRef = useRef();
  const [messages, setMessages] = useState();
  const [input, setInput] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);

  //getlistuser and set conversation
  useEffect(() => {
    const fetchListUser = async () => {
      setConversation([]);
      const data = {
        id_sender: currentUser,
      };
      const response = await GetListUser(data);
      if (response.status === 200) {
        setConversation(response.data);
      }
    };
    fetchListUser();
  }, [currentUser]);

  //dùng để set currentChat khi load lại trang
  useEffect(() => {
    const currentpath = location.pathname;
    if (currentpath !== "/chat") {
      const id = currentpath.split("/")[2];
      setCurrentChat(id);
    }
  }, [location.pathname]);

  //cái này để set currentUser thôi
  useEffect(() => {
    if (userInfo.roll === "adminapp") {
      setCurrentUser("6442aa5167b30af877e4ee71");
    } else {
      setCurrentUser(
        totalHotel?.filter((item) => item.id === userInfo?.idHotel)[0]?._id
      );
    }
  }, [userInfo, totalHotel]);

  //cái này để connect socket
  useEffect(() => {
    if (currentUser) {
      socket.current = io(LOCAL_API_URL);
      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  //cái này update conversation khi có tin nhắn mới
  const handlePushMsgToConversation = useCallback(
    async (data) => {
      const id_conversation = data._id._id;
      //find index of conversation
      const index = conversation.findIndex(
        (item) => item._id._id === id_conversation
      );
      // update conversation and move to top
      if (index !== -1) {
        const newConversation = [...conversation];
        const dataNew = {
          _id: conversation[index]._id,
          message: data.message,
          updatedAt: data.updatedAt,
        };
        newConversation.splice(index, 1);
        newConversation.unshift(dataNew);
        setConversation(newConversation);
      }
      //add new conversation
      else {
        const response = await GetSingleUser(id_conversation);
        console.log(response);
        const dataNew = {
          _id: {
            _id: response.data.data.user._id,
            name: response.data.data.user.name,
          },
          message: data.message,
          updatedAt: data.updatedAt,
        };
        const newConversation = [...conversation];
        newConversation.unshift(dataNew);
        setConversation(newConversation);
      }
    },
    [conversation]
  );

  //cái này để khi nào ấn vòa conversation thì nó sẽ lấy ra tin nhắn
  useEffect(() => {
    const getMsg = async () => {
      const data = {
        from: currentUser,
        to: currentChat,
      };
      const response = await RecieveMessage(data);
      if (response.status === 200) {
        setMessages(response.data.messages);
        console.log(response.data);
        setCurrentInfo(response.data.user);
      }
    };
    getMsg();
  }, [currentChat, currentUser]);

  useEffect(() => {
    const handleMsgRecieve = (data) => {
      if (data.from === currentChat) {
        setArrivalMessage({
          fromSelf: false,
          message: {
            text: data.msg,
          },
        });
      }
      const dataUpdateConversation = {
        _id: {
          _id: data.from,
        },
        message: {
          text: data.msg,
          sender: false,
        },
        updatedAt: Date.now(),
      };
      handlePushMsgToConversation(dataUpdateConversation);
    };

    if (socket.current) {
      socket.current.on("msg-recieve", handleMsgRecieve);
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve", handleMsgRecieve);
      }
    };
  }, [socket, currentChat, handlePushMsgToConversation, conversation]);

  //cái này để set tin nhắn mới vào messages
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    scrollChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //cái này để gửi tin nhắn
  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat,
      from: currentUser,
      msg,
    });

    const msgs = Array.isArray(messages) ? [...messages] : [];
    msgs.push({
      fromSelf: true,
      message: {
        text: msg,
      },
    });
    setMessages(msgs);

    const data = {
      from: currentUser,
      fromType: userInfo.roll === "adminapp" ? "admin" : "hotel",
      to: currentChat,
      toType: "user",
      message: msg,
    };

    const dataUpdateConversation = {
      _id: {
        _id: currentChat,
      },
      message: {
        text: msg,
        sender: true,
      },
      updatedAt: Date.now(),
    };
    handlePushMsgToConversation(dataUpdateConversation);

    await SendMessage(data);
  };

  const formatTime = (timestamp) => {
    //format like: now , 1 minute ,1 hour, 1 day,yesterday, 21/09/2021
    const now = moment();
    const time = moment(timestamp);
    const diff = now.diff(time, "days");
    if (diff === 0) {
      return "Today";
    }
    if (diff === 1) {
      return "Yesterday";
    }
    if (diff < 7) {
      return time.format("dddd");
    }
    return time.format("DD/MM/YYYY");
  };

  //cái này để chọn conversation
  const handleChooseConversation = (item) => {
    setCurrentInfo(item._id);
    setCurrentChat(item._id._id);
    const path = `/chat/${item._id._id}`;
    window.history.pushState({}, null, path);
  };

  return (
    <div className="chat">
      <div className="container">
        <div className="contact">
          <div className="contactHeader">
            <p>Chat</p>
            <AddCircleIcon className="icon" />
          </div>
          <div className="contactBody">
            {conversation
              ?.map((item) => (
                <div
                  onClick={() => {
                    handleChooseConversation(item);
                  }}
                  key={uuidv4()}
                  className={`contactItem ${
                    currentChat === item._id._id ? "active" : ""
                  }`}
                >
                  <img src={avatar} alt="" className="contactImg" />
                  <div className="contactInfo">
                    <div className="contactInfoNameandTime">
                      <p className="contactName">{item._id.name}</p>
                      <p className="contactTime">
                        {formatTime(item.updatedAt)}
                      </p>
                    </div>
                    <p className="contactMsg">
                      {item.message.sender
                        ? `You: ${item.message.text}`
                        : item.message.text}
                    </p>
                  </div>
                </div>
              ))
              .sort((a, b) => {
                a = new Date(a.updatedAt);
                b = new Date(b.updatedAt);
                return a > b ? -1 : a < b ? 1 : 0;
              })}
          </div>
        </div>
        <div ref={scrollRef} className="chatContainer">
          {currentChat ? (
            messages ? (
              <div className="container">
                <div className="chatHeader">
                  <div className="InfoHeader">
                    <img src={avatar} alt="" className="HeaderImg" />
                    <p className="contactName">{currentInfo?.name}</p>
                  </div>
                  <MoreHorizIcon className="icon" />
                </div>
                <div className="chatBody">
                  {messages?.map((item) => (
                    <div
                      key={uuidv4()}
                      className={`chatMsg ${
                        item.fromSelf ? "chatMsgSelf" : "chatMsgOther"
                      }`}
                    >
                      <div className="chatMsgContent">
                        <p className="chatMsgText">{item.message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chatFooter">
                  <div className="chatFooterInput">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (input !== "") {
                            handleSendMsg(input);
                            setInput("");
                          }
                        }
                      }}
                    />
                  </div>
                  <SendIcon
                    className="icon"
                    onClick={() => {
                      if (input !== "") {
                        handleSendMsg(input);
                        setInput("");
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <></>
            )
          ) : (
            <div className="chatStart">
              <p className="chatStartText">
                Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
