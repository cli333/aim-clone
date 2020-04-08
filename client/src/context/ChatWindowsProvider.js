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

  useEffect(() => {
    if (authUser) {
      // if chat window doesn't exist open a new chat window
      socket.on("Open chat window", (messageObj) => {
        let openWindow = chatWindows.filter(
          (c) => c.receiver === messageObj.notMe
        );
        if (openWindow.length === 0) {
          handleNewWindow({ receiver: messageObj.notMe });
        }
      });
    }
  }, [authUser, socket, chatWindows]);

  function handleNewWindow(buddy) {
    const position = {
      x: lastPosition.x + 25,
      y: lastPosition.y + 25,
    };
    // buddy = {receiver: '${id};${screenName}'}
    let openWindow = chatWindows.filter(
      (c) => c.receiver === buddy.receiver || buddy.user
    );
    if (openWindow.length === 0) {
      const newWindow = { receiver: buddy.receiver || buddy.user, position };
      setChatWindows([...chatWindows, newWindow]);
      setLastPosition(position);
    }
  }

  function handleCloseWindow(idx) {
    const newBuddies = chatWindows
      .slice(0, idx)
      .concat(chatWindows.slice(idx + 1));
    setChatWindows(newBuddies);
  }

  return (
    <chatWindowsCtx.Provider
      value={{ chatWindows, handleNewWindow, handleCloseWindow }}
    >
      {children}
    </chatWindowsCtx.Provider>
  );
};
