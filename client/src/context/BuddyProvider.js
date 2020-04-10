import React, { useState, useContext, createContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";
import { socketCtx } from "./SocketProvider";

export const buddyCtx = createContext();

export default ({ children }) => {
  const [offlineBuddies, setOfflineBuddies] = useState([]);
  const [onlineBuddies, setOnlineBuddies] = useState([]);
  const [totalBuddies, setTotalBuddies] = useState(0);
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  /* 
    populate buddy list
  */

  useEffect(() => {
    if (authUser) {
      socket.emit("get buddies", authUser);
    }
  }, [socket, authUser]);

  /* 
    separate buddies into online/offline
  */

  useEffect(() => {
    if (authUser) {
      socket.on("Got buddies", (buddies) => {
        setOfflineBuddies(buddies.offlineBuddies);
        setOnlineBuddies(buddies.onlineBuddies);
        setTotalBuddies(
          buddies.offlineBuddies.length + buddies.onlineBuddies.length
        );
      });
    }
  }, [socket, authUser]);

  return (
    <buddyCtx.Provider value={{ offlineBuddies, onlineBuddies, totalBuddies }}>
      {children}
    </buddyCtx.Provider>
  );
};
