import React from "react";
import "./ChatWindow.css";
import Window from "../Window/Window";

export default ({ position: { x, y } }) => {
  return (
    <Window
      header="smixity - Instant Message"
      handle="chat-window"
      style={{
        position: "absolute",
        width: "550px",
        height: "500px",
        top: `${y}px`,
        left: `${x}px`
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
      <form className="chatfield-wrapper">
        <textarea className="chatfield"></textarea>
      </form>
    </Window>
  );
};
