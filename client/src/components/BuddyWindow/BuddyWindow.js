import React, { useState, useContext } from "react";
import "./BuddyWindow.css";
import Window from "../Window/Window";
import BuddyList from "../BuddyList/BuddyList";
import { authCtx } from "../../context/AuthProvider";
import { buddyCtx } from "../../context/BuddyProvider";
import useBuddy from "../../hooks/useBuddy";

export default () => {
  const [displayAdd, setDisplayAdd] = useState(false);
  const { authUser } = useContext(authCtx);
  const { onlineBuddies, offlineBuddies } = useContext(buddyCtx);
  const [input, setInput] = useState("");
  const { handleSubmit, errors, setErrors } = useBuddy({
    input,
    setInput,
  });

  return (
    <Window
      header={`${authUser.screenName}'s Buddy List`}
      handle="buddy-window"
      defaultPosition={{ x: 300, y: -450 }}
      style={{ width: "225px", height: "700px" }}
    >
      <div className="banner">
        <img src="/banner.png" alt="banner" />
      </div>
      <div className="buddy-list">
        <BuddyList buddies={onlineBuddies} category={"Online"} />
        <BuddyList buddies={offlineBuddies} category={"Offline"} />
      </div>
      <div className="buddy-form">
        <button onClick={() => setDisplayAdd(!displayAdd)}>
          <img src="/addfriend.png" alt="add" />
        </button>
        {displayAdd && (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              placeholder={`${errors.input || "add a buddy"}`}
              value={input}
              onChange={(e) => {
                if (Object.keys(errors).length !== 0) setErrors({});
                setInput(e.target.value);
              }}
            />
          </form>
        )}
      </div>
    </Window>
  );
};
