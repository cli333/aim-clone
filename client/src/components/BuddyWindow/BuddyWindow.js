import React from "react";
import "./BuddyWindow.css";
import Window from "../Window/Window";
import BuddyList from "../BuddyList/BuddyList";

export default () => {
  return (
    <Window
      header="User's Buddy List"
      handle="buddy-window"
      defaultPosition={{ x: 300, y: -450 }}
      style={{ width: "225px", height: "700px" }}
    >
      <div className="buddy-list">
        <BuddyList
          buddies={["smixity", "JOhnSmith", "CarolDanvers", "YoshiIsCool37"]}
          category={"Online"}
        />
        <BuddyList
          buddies={["quex", "Elite1337", "Smilley", "JohnWaine"]}
          category={"Offline"}
        />
      </div>
    </Window>
  );
};
