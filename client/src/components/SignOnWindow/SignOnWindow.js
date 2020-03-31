import React from "react";
import "./SignOnWindow.css";
import Window from "../Window/Window";

export default () => {
  return (
    <Window
      header="Sign On"
      handle="sign-on-window"
      defaultPosition={{ x: 900, y: 100 }}
      style={{ width: "300px" }}
    >
      <div className="signon-body">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="logo" className="logo" />
        </div>
        <hr className="divider" />
        <div className="signon-bottom">
          <div className="input">
            <label htmlFor="screenname" className="screenname">
              ScreenName
              <span role="img" aria-label="img">
                🔑
              </span>
            </label>
            <input name="screenname" type="text" placeholder="screen name" />
          </div>

          <div className="input">
            <label htmlFor="password" className="password">
              Password
            </label>
            <input name="password" type="password" placeholder="password" />
          </div>
        </div>

        <div className="signon-button-wrapper">
          <button className="signon-button">
            <img src="/icon2.png" alt="sign in" />
            <div>
              <span>S</span>ign On
            </div>
          </button>
        </div>
      </div>
    </Window>
  );
};
