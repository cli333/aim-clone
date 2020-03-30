import React from "react";
import "./SignOnWindow.css";
import Draggable from "react-draggable";

export default () => {
  return (
    <Draggable handle=".handle" defaultPosition={{ x: 150, y: 200 }}>
      <div className="signon-window">
        <div className="handle window-header">
          <img className="window-header-icon" src="/icon.png" alt="icon" />
          Sign On <button className="window-header-button">X</button>
        </div>
        <div className="logo-wrapper">
          <img src="/logo.png" alt="logo" className="logo" />
        </div>
        <hr />
        <div>
          <div>
            <span>ScreenName</span>
            <span role="img" aria-label="img">
              🔑
            </span>
          </div>
          <input placeholder="screen name" />
          <div>
            <a href="#">Get a Screen Name</a>
          </div>
        </div>
        <br />
        <div>
          <div>Password</div>
          <input type="password" placeholder="password" />
        </div>
        <div>
          <button>
            <div>
              <img src="/icon2.png" alt="sign in" />
            </div>
            <div>
              <span>S</span>ign In
            </div>
          </button>
        </div>
      </div>
    </Draggable>
  );
};
