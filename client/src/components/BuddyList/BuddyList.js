import React, { useState } from "react";
import "./BuddyList.css";
import useClick from "../../hooks/useClick";

export default ({ buddies, category }) => {
  const [open, setOpen] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);
  const [activeBuddy, setActiveBuddy] = useState(null);
  const { handleClick, handleDoubleClick } = useClick(onClick, onDoubleClick);

  function onClick(idx) {
    if (idx !== activeIdx) {
      setActiveIdx(idx);
    } else {
      setActiveIdx(null);
    }
  }

  function onDoubleClick() {
    console.log("DOUBLE click", activeBuddy);
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
      <span>{category}</span>
      {open && (
        <ul className="category-type">
          {buddies.length > 0 &&
            buddies.map((buddy, idx) => (
              <li
                className={`${idx === activeIdx ? "active" : ""}`}
                key={idx}
                onClick={() => {
                  setActiveIdx(idx);
                  handleClick(idx);
                }}
                onMouseEnter={() => setActiveBuddy(buddy)}
                onMouseLeave={() => setActiveBuddy(null)}
                onDoubleClick={() => handleDoubleClick(buddy)}
              >
                {buddy}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
