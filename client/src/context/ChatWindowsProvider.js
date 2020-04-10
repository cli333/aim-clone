import React, { createContext, useState, useContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";
import { socketCtx } from "./SocketProvider";
import { buddyCtx } from "./BuddyProvider";

export const chatWindowsCtx = createContext();

export default ({ children }) => {
  const [chatWindows, setChatWindows] = useState([]);
  const [lastPosition, setLastPosition] = useState({ x: 400, y: 200 });
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);
  const { onlineBuddies } = useContext(buddyCtx);

  /* 
    inside open chat
    if window not open
    open window
  */

  const handleNewWindow = (buddy) => {
    const isWindowOpen = chatWindows.some(
      (window) => window.receiver === buddy
    );
    if (!isWindowOpen) {
      const newPosition = { x: lastPosition.x + 25, y: lastPosition.y + 25 };
      const newWindow = {
        sender: `${authUser.id};${authUser.screenName}`,
        receiver: buddy,
        room: `${authUser.id};${authUser.screenName}/${buddy}`,
        position: newPosition,
      };
      setChatWindows([...chatWindows, newWindow]);
      setLastPosition(newPosition);
    }
  };

  /* 
    user logs off
    close all windows
  */

  useEffect(() => {
    if (!authUser) {
      setChatWindows([]);
    }
  }, [authUser]);

  /*
    outside open chat request
    if window with sender not open
    open a window
  */

  useEffect(() => {
    if (authUser) {
      socket.on("Open chat window", (messageObj) => {
        const newPosition = {
          x: lastPosition.x + 25,
          y: lastPosition.y + 25,
        };
        const newWindow = {
          sender: messageObj.sender,
          receiver: messageObj.receiver,
          room: messageObj.room,
          position: newPosition,
        };
        setChatWindows((prevWindows) => {
          if (prevWindows.some((window) => window.room === messageObj.room)) {
            return prevWindows;
          } else {
            return [...prevWindows, newWindow];
          }
        });
        setLastPosition(newPosition);
        socket.emit("join room", messageObj.room);
      });
    }
  }, [authUser, socket, lastPosition]);

  /* 
    if sender logs off
    close sender chat windows on receiver's end
  */

  useEffect(() => {
    setChatWindows((prevWindows) => {
      const flattenedOnlineBuddies = onlineBuddies.map(
        (buddy) => buddy.screenName
      );
      const filteredWindows = prevWindows.filter(
        (window) =>
          flattenedOnlineBuddies.includes(window.receiver) ||
          flattenedOnlineBuddies.includes(window.sender)
      );
      return filteredWindows;
    });
  }, [onlineBuddies]);

  return (
    <chatWindowsCtx.Provider value={{ chatWindows, handleNewWindow }}>
      {children}
    </chatWindowsCtx.Provider>
  );
};
