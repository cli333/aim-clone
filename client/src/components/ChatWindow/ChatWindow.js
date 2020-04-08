import React, { useState } from "react";
import "./ChatWindow.css";
import Window from "../Window/Window";
import useChatWindow from "../../hooks/useChatWindow";

export default ({ position: { x, y }, receiver }) => {
  const [message, setMessage] = useState("");
  const { handleSubmit } = useChatWindow({ message, setMessage, receiver });
  const screenName = receiver.split(";")[1];

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
        <li>
          <span className="user">smixity</span>: <span>Hey what's up?</span>
        </li>
        <li>
          <span className="user">Me</span>:{" "}
          <span>Nothing much ado here!!!</span>
        </li>
      </ul>

      <hr className="chat-divider" />
      <form className="chatfield-wrapper" onSubmit={(e) => handleSubmit(e)}>
        <textarea
          className="chatfield"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </form>
    </Window>
  );
};
