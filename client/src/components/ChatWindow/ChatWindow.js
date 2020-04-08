import React, { useState, useEffect, useContext } from "react";
import "./ChatWindow.css";
import Window from "../Window/Window";
import useChatWindow from "../../hooks/useChatWindow";
import { socketCtx } from "../../context/SocketProvider";
import { authCtx } from "../../context/AuthProvider";

export default ({ position: { x, y }, receiver }) => {
  const [message, setMessage] = useState("");
  const { handleSubmit } = useChatWindow({ message, setMessage, receiver });
  const screenName = receiver.split(";")[1];
  const { socket } = useContext(socketCtx);
  const { authUser } = useContext(authCtx);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (authUser) {
      socket.on("Sent message", (messageObj) => {
        // if notMe === receiver
        // append to list
        // setMessages([...messages, messageObj]);

        // FIX THIS WHY setMessages doesn't work????
        const { me, notMe, message } = messageObj;
        const target = document.querySelector(".chatwindow");
        let newEl = document.createElement("li");
        newEl.innerHTML = `<span className="me">${
          me.split(";")[1]
        }</span>:${" "}<span>${message}</span>`;
        target.appendChild(newEl);
      });
    }
  }, [authUser, socket]);

  return (
    <Window
      header={`${screenName} - Instant Message`}
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
        {messages.map((msg) => (
          <li>
            <span className="me">{msg.me.split(";")[1]}</span>:{" "}
            <span>{msg.message}</span>
          </li>
        ))}
      </ul>

      <hr className="chat-divider" />
      <form className="chatfield-wrapper" onSubmit={(e) => handleSubmit(e)}>
        <textarea
          className="chatfield"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="send-button" onClick={(e) => {}}>
          <img src="/send.png" alt="send" />
          <div>
            <span>S</span>end
          </div>
        </button>
      </form>
    </Window>
  );
};
