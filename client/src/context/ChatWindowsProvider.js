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

  const handleNewWindow = (buddy) => {
    // buddy TYPE => string
    // chatWindows TYPE =>
    // {sender: id;screenname, receiver: id;screenname, message: String,
    // directive: Open Window / Send Message, room: sender + receiver}

    const isWindowOpen =
      chatWindows.filter((window) => window.receiver === buddy).length > 0;
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

  // FIX BELOW

  const handleCloseWindow = (idx) => {
    const newBuddies = chatWindows
      .slice(0, idx)
      .concat(chatWindows.slice(idx + 1));
    setChatWindows(newBuddies);
  };

  // WHAT IS GOING ON HERE???
  // useEffect(() => {
  //   const flattenedOnlineBuddies = onlineBuddies.map((o) => o.buddy);
  //   const filteredWindows = chatWindows.filter((c) =>
  //     flattenedOnlineBuddies.includes(c.receiver)
  //   );
  //   if (filteredWindows.length !== chatWindows.length) {
  //     setChatWindows(filteredWindows);
  //   }
  // }, [onlineBuddies, chatWindows]);

  useEffect(() => {
    if (!authUser) {
      setChatWindows([]);
    }
  }, [authUser]);

  // TEAR THIS ALL DOWN
  // BUILD FROM SCRATCH

  /*
  opening a new window and sending a message should create a new room,
  the sender joins the room
  room is called "sender-receiver"

  send an OPEN WINDOW command first with the name of the room
  then when the responder responds to that message
  have the responder join the room

  when receiver sends a message, they should join that room
  THE message object sent to server / users should contain
  {sender, receiver, message, room}

  if window not open, open a window with the name of 'sender-receiver'
  */

  useEffect(() => {
    if (authUser) {
      socket.on("Open chat window", (messageObj) => {
        const isWindowNotOpen =
          chatWindows.filter((window) => window.room === messageObj.room)
            .length === 0;

        if (isWindowNotOpen) {
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
          setChatWindows((prevWindows) => [...prevWindows, newWindow]);
          setLastPosition(newPosition);
          socket.emit("join room", messageObj.room);
        }
      });
    }
  }, [authUser, socket, chatWindows, lastPosition]);

  return (
    <chatWindowsCtx.Provider
      value={{ chatWindows, handleNewWindow, handleCloseWindow }}
    >
      {children}
    </chatWindowsCtx.Provider>
  );
};
