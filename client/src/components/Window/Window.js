import React from "react";
import "./Window.css";
import Draggable from "react-draggable";

export default ({ children, header, handle, defaultPosition, style }) => {
  const bringToFront = (e) => {
    let windows = document.querySelectorAll(".window");
    for (let window of windows) {
      window.style.zIndex = 1;
      e.currentTarget.style.zIndex = 10;
    }
  };

  return (
    <Draggable
      handle={`.${handle}`}
      defaultPosition={defaultPosition}
      style={{ position: "relative" }}
    >
      <div
        className="window"
        style={style}
        onClick={(e) => bringToFront(e)}
        onDragEnter={(e) => bringToFront(e)}
      >
        <div className={`header ${handle}`}>
          <img className="icon" src="/icon.png" alt="icon" />
          {header}

          {/* <button className="button">X</button> */}
        </div>
        {children}
      </div>
    </Draggable>
  );
};
