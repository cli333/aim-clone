import React, { createContext, useState } from "react";

export const chatWindowsCtx = createContext();

export default ({ children }) => {
  const [buddies, setBuddies] = useState([]);
  const [lastPosition, setLastPosition] = useState({ x: 400, y: 200 });

  const handleNewWindow = buddy => {
    const position = {
      x: lastPosition.x + 25,
      y: lastPosition.y + 25
    };
    const newBuddy = { ...buddy, position };
    setBuddies([...buddies, newBuddy]);
    setLastPosition(position);
  };

  const handleCloseWindow = idx => {
    const newBuddies = buddies.slice(0, idx).concat(buddies.slice(idx + 1));
    setBuddies(newBuddies);
  };

  return (
    <chatWindowsCtx.Provider
      value={{ buddies, handleNewWindow, handleCloseWindow }}
    >
      {children}
    </chatWindowsCtx.Provider>
  );
};
