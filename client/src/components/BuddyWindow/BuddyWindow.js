import React, { useState } from "react";
import "./BuddyWindow.css";
import Window from "../Window/Window";
import BuddyList from "../BuddyList/BuddyList";

export default () => {
  const [displayAdd, setDisplayAdd] = useState(false);

  return (
    <Window
      header="User's Buddy List"
      handle="buddy-window"
      defaultPosition={{ x: 300, y: -450 }}
      style={{ width: "225px", height: "700px" }}
    >
      <div className="banner">
        <img src="/banner.png" alt="banner" />
      </div>
      <div className="buddy-list">
        <BuddyList
          buddies={[
            "smixity",
            "JOhnSmith",
            "CarolDanvers",
            "YoshiIsCool37",
            "ShopGirl"
          ]}
          category={"Online"}
        />
        <BuddyList
          buddies={["quex", "Elite1337", "Smilley", "JohnWaine"]}
          category={"Offline"}
        />
      </div>
      <div className="buddy-form">
        <button onClick={() => setDisplayAdd(!displayAdd)}>
          <img src="/addfriend.png" alt="add" />
        </button>
        {displayAdd && (
          <form>
            <input type="text" placeholder="add a buddy" />
          </form>
        )}
      </div>
    </Window>
  );
};
