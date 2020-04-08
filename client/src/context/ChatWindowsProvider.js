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

  useEffect(() => {
    const flattenedOnlineBuddies = onlineBuddies.map((o) => o.buddy);
    const filteredWindows = chatWindows.filter((c) =>
      flattenedOnlineBuddies.includes(c.receiver)
    );
    if (filteredWindows.length !== chatWindows.length) {
      setChatWindows(filteredWindows);
    }
  }, [onlineBuddies, chatWindows]);

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
          (c) => c.receiver === messageObj.receiver
        );
        console.log({ chatWindows, openWindow });
        if (openWindow.length === 0) {
          ((buddy) => {
            const position = {
              x: lastPosition.x + 25,
              y: lastPosition.y + 25,
            };
            const newWindow = {
              receiver: buddy.receiver || buddy.user,
              position,
            };
            setChatWindows([...chatWindows, newWindow]);
            setLastPosition(position);
          })({ receiver: messageObj.receiver });
        }
      });
    }
  }, [authUser, socket, chatWindows, lastPosition]);

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
