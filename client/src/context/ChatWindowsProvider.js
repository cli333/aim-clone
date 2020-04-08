import React, { createContext, useState, useContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";
import { socketCtx } from "./SocketProvider";

export const chatWindowsCtx = createContext();

export default ({ children }) => {
  const [chatWindows, setChatWindows] = useState([]);
  const [lastPosition, setLastPosition] = useState({ x: 400, y: 200 });
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  const handleNewWindow = (buddy) => {
    const position = {
      x: lastPosition.x + 25,
      y: lastPosition.y + 25,
    };
    // buddy = {receiver: '${id};${screenName}'}
    const newWindow = { ...buddy, position };
    setChatWindows([...chatWindows, newWindow]);
    setLastPosition(position);
  };

  useEffect(() => {
    if (!authUser) {
      setChatWindows([]);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      // if chat window doesn't exist open a new chat window
      socket.on("Open chat window", (messageObj) => {
        // if (chatWindows.filter((c) => c.receiver === messageObj.notMe) !== 0) {
        //   handleNewWindow(messageObj.notMe);
        // }
        console.log("open window");
      });
    }
  }, [authUser, socket, chatWindows, handleNewWindow]);

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
