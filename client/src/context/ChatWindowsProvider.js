import React, { createContext, useState, useContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";
import { socketCtx } from "./SocketProvider";

export const chatWindowsCtx = createContext();

export default ({ children }) => {
  const [chatWindows, setChatWindows] = useState([]);
  const [lastPosition, setLastPosition] = useState({ x: 400, y: 200 });
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  useEffect(() => {
    if (!authUser) {
      setChatWindows([]);
    }
  }, [authUser]);

  const handleNewWindow = (buddy) => {
    const position = {
      x: lastPosition.x + 25,
      y: lastPosition.y + 25,
    };
    const newWindow = { ...buddy, position };
    setChatWindows([...chatWindows, newWindow]);
    setLastPosition(position);
  };

  const handleCloseWindow = (idx) => {
    const newBuddies = chatWindows
      .slice(0, idx)
      .concat(chatWindows.slice(idx + 1));
    setChatWindows(newBuddies);
  };

  return (
    <chatWindowsCtx.Provider
      value={{ chatWindows, handleNewWindow, handleCloseWindow }}
    >
      {children}
    </chatWindowsCtx.Provider>
  );
};
