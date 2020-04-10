import React, { useState, useContext } from "react";
import "./BuddyList.css";
import useClick from "../../hooks/useClick";
import { chatWindowsCtx } from "../../context/ChatWindowsProvider";

export default ({ buddies, category, totalBuddies }) => {
  const [open, setOpen] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeBuddy, setActiveBuddy] = useState(null);
  const { handleClick, handleDoubleClick } = useClick(onClick, onDoubleClick);
  const { handleNewWindow } = useContext(chatWindowsCtx);
  const { chatWindows } = useContext(chatWindowsCtx);

  /*
  set the active buddy
  */

  function onClick(idx) {
    if (idx !== activeIdx) {
      setActiveIdx(idx);
    } else {
      setActiveIdx(null);
    }
  }

  /*
  open a new window
  if window with the buddy as the receiver or sender doesn't exist
  */

  function onDoubleClick() {
    if (
      category === "Online" &&
      !chatWindows.some(
        (window) =>
          window.receiver === activeBuddy || window.sender === activeBuddy
      )
    ) {
      handleNewWindow(activeBuddy);
    }
  }

  return (
    <div className="category">
      {!open ? (
        <span role="img" aria-label="up" onClick={() => setOpen(!open)}>
          🔼
        </span>
      ) : (
        <span role="img" aria-label="down" onClick={() => setOpen(!open)}>
          🔽
        </span>
      )}
      <span>
        {category}{" "}
        <span
          style={{ fontWeight: "100" }}
        >{`(${buddies.length}/${totalBuddies})`}</span>
      </span>
      {open && (
        <ul className="category-type">
          {buddies &&
            buddies.map(({ buddy }, idx) => {
              const [id, screenName] = buddy.split(";");
              return (
                <li
                  className={`${idx === activeIdx ? "active" : ""}`}
                  key={id}
                  onClick={() => {
                    setActiveIdx(idx);
                    handleClick(idx);
                  }}
                  onMouseEnter={() => setActiveBuddy(buddy)}
                  onMouseLeave={() => setActiveBuddy(null)}
                  onDoubleClick={() => handleDoubleClick()}
                >
                  {screenName}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};
