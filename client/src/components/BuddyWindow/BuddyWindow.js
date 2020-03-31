import React, { useState } from "react";
import "./BuddyWindow.css";
import Window from "../Window/Window";

export default () => {
  const [onlineOpen, setOnlineOpen] = useState(true);
  const [offlineOpen, setOfflineOpen] = useState(true);

  const handleOpen = type => {
    switch (type) {
      case "online":
        setOnlineOpen(!onlineOpen);
        break;
      case "offline":
        setOfflineOpen(!offlineOpen);
        break;
      default:
        break;
    }
  };

  return (
    <Window
      header="User's Buddy List"
      handle="buddy-window"
      defaultPosition={{ x: 300, y: -450 }}
      style={{ width: "225px", height: "700px" }}
    >
      <div className="buddy-list">
        <div className="category">
          {!onlineOpen ? (
            <span
              role="img"
              aria-label="up"
              onClick={() => handleOpen("online")}
            >
              🔼
            </span>
          ) : (
            <span
              role="img"
              aria-label="down"
              onClick={() => handleOpen("online")}
            >
              🔽
            </span>
          )}
          <span>Online</span>
          {onlineOpen && (
            <ul className="category-online">
              <li>smixity</li>
              <li>JOhnSmith</li>
              <li>clling333</li>
              <li>CarolDanvers</li>
              <li>YoshiIsCool64</li>
              <li>WiseTurtle1337</li>
            </ul>
          )}
        </div>
        <div className="category">
          {!offlineOpen ? (
            <span
              role="img"
              aria-label="up"
              onClick={() => handleOpen("offline")}
            >
              🔼
            </span>
          ) : (
            <span
              role="img"
              aria-label="down"
              onClick={() => handleOpen("offline")}
            >
              🔽
            </span>
          )}
          <span>Offline</span>
          {offlineOpen && (
            <ul className="category-offline">
              <li>IamHero</li>
              <li>Jamella</li>
              <li>crePuscularMouse</li>
            </ul>
          )}
        </div>
      </div>
    </Window>
  );
};
