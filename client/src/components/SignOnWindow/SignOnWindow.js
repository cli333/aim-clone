import React, { useState, useContext } from "react";
import "./SignOnWindow.css";
import Window from "../Window/Window";
import useAuth from "../../hooks/useAuth";
import { authCtx } from "../../context/AuthProvider";

export default () => {
  const [screenName, setScreenName] = useState("");
  const [password, setPassword] = useState("");
  const { errors, setErrors, handleSubmit } = useAuth({
    screenName,
    setScreenName,
    password,
    setPassword,
  });
  const { authUser, handleSignOut } = useContext(authCtx);

  return (
    <Window
      header="Sign On"
      handle="sign-on-window"
      defaultPosition={{ x: 900, y: 100 }}
      style={{ width: "300px" }}
    >
      <form className="signon-body">
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
            <input
              name="screenname"
              type="text"
              placeholder={`${errors.screenName || "screen name"}`}
              value={screenName}
              onChange={(e) => {
                if (Object.keys(errors).length !== 0) setErrors({});
                setScreenName(e.target.value);
              }}
              disabled={authUser}
            />
          </div>

          <div className="input">
            <label htmlFor="password" className="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder={`${errors.password || "password"}`}
              value={password}
              onChange={(e) => {
                if (Object.keys(errors).length !== 0) setErrors({});
                setPassword(e.target.value);
              }}
              disabled={authUser}
            />
          </div>
        </div>

        <div className="signon-button-wrapper">
          {!authUser ? (
            <button className="signon-button" onClick={(e) => handleSubmit(e)}>
              <img src="/icon2.png" alt="sign in" />
              <div>
                <span>S</span>ign On
              </div>
            </button>
          ) : (
            <button className="signon-button" onClick={(e) => handleSignOut(e)}>
              <img className="signout" src="/icon2.png" alt="sign out" />
              <div>
                <span>S</span>ign Out
              </div>
            </button>
          )}
        </div>
      </form>
    </Window>
  );
};
