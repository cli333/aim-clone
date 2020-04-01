import React from "react";
import "./Window.css";
import Draggable from "react-draggable";

export default ({ children, header, handle, defaultPosition, style }) => {
  return (
    <Draggable
      handle={`.${handle}`}
      defaultPosition={defaultPosition}
      style={{ position: "relative" }}
    >
      <div className="window" style={style}>
        <div className={`header ${handle}`}>
          <img className="icon" src="/icon.png" alt="icon" />
          {header}

          <button className="button">X</button>
        </div>
        {children}
      </div>
    </Draggable>
  );
};
