import React, { useState, useEffect, useContext } from "react";
import "./ChatWindow.css";
import Window from "../Window/Window";
import useChatWindow from "../../hooks/useChatWindow";
import { socketCtx } from "../../context/SocketProvider";
import { authCtx } from "../../context/AuthProvider";

export default ({
  position: { x, y },
  room,
  receiver,
  sender,
  randomNumber,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const { handleSubmit } = useChatWindow({
    messageInput,
    setMessageInput,
    receiver,
    room,
  });
  const { socket } = useContext(socketCtx);
  const { authUser } = useContext(authCtx);
  const [messages, setMessages] = useState([]);

  /*
    window props
    {
      sender: `${authUser.id};${authUser.screenName}`,
      receiver: id:screenName,
      room: `${authUser.id};${authUser.screenName}/${buddy}`,
      position: newPosition,
    }

    message object
    {
      sender,
      receiver,
      room,
      message
    }
  */

  /* 
    if message object's room is the same as the window's room
    append message
  */

  useEffect(() => {
    if (authUser) {
      socket.on("Sent message", (messageObj) => {
        if (messageObj.room === room) {
          setMessages((prevMessages) => [...prevMessages, messageObj]);
        }
      });
    }
  }, [authUser, socket, room]);

  return (
    <Window
      header={`${
        receiver === authUser.id + ";" + authUser.screenName
          ? sender.split(";")[1]
          : receiver.split(";")[1]
      } - Instant Message`}
      handle="chat-window"
      style={{
        position: "absolute",
        width: "550px",
        height: "500px",
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <ul className="chatwindow">
        {messages.map((message, idx) =>
          message.sender === `${authUser.id};${authUser.screenName}` ? (
            <li key={`${idx}${message.message}`}>
              <span className="me">{authUser.screenName}</span>:{" "}
              <span>{message.message}</span>
            </li>
          ) : (
            <li key={`${idx}${message.message}`}>
              <span className="not-me">{message.sender.split(";")[1]}</span>:{" "}
              <span>{message.message}</span>
            </li>
          )
        )}
      </ul>

      <hr className="chat-divider" />
      <form className="chatfield-wrapper" onSubmit={(e) => handleSubmit(e)}>
        <textarea
          className="chatfield"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        ></textarea>
        <img
          src={`/banner${randomNumber}.gif`}
          alt="90s banner"
          className="banner"
        />
        <button className="send-button">
          <img src="/send.png" alt="send" />
          <div>
            <span>S</span>end
          </div>
        </button>
      </form>
    </Window>
  );
};
