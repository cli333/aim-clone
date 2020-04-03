import React, { useState, useContext, createContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";
import { socketCtx } from "./SocketProvider";

export const buddyCtx = createContext();

export default ({ children }) => {
  const [offlineBuddies, setOfflineBuddies] = useState([]);
  const [onlineBuddies, setOnlineBuddies] = useState([]);
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  useEffect(() => {
    if (authUser) socket.emit("get friends", authUser);
    socket.on("got friends", friends =>
      friends ? setOfflineBuddies(friends) : null
    );
    socket.on("user signed on", ({ screenName }) => {
      let updatedOnlineBuddies = [...onlineBuddies, screenName];
      let updatedOfflineBuddies = offlineBuddies.filter(
        buddy => buddy !== screenName
      );
      if (offlineBuddies.indexOf(screenName) > -1) {
        setOfflineBuddies(updatedOfflineBuddies);
        setOnlineBuddies(updatedOnlineBuddies);
      }
    });
    socket.on("user signed out", ({ screenName }) => {
      let updatedOnlineBuddies = onlineBuddies.filter(
        buddy => buddy !== screenName
      );
      let updatedOfflineBuddies = [...offlineBuddies, screenName];
      if (onlineBuddies.includes(screenName)) {
        setOnlineBuddies(updatedOnlineBuddies);
        setOfflineBuddies(updatedOfflineBuddies);
      }
    });
  });

  return (
    <buddyCtx.Provider value={{ offlineBuddies, onlineBuddies }}>
      {children}
    </buddyCtx.Provider>
  );
};
