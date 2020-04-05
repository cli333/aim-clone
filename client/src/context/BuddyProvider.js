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
    if (authUser) {
      socket.emit("get buddies", authUser);
    }
    socket.on("Got buddies", (buddies) => console.log(buddies));
  }, [socket, authUser]);

  return (
    <buddyCtx.Provider value={{ offlineBuddies, onlineBuddies }}>
      {children}
    </buddyCtx.Provider>
  );
};
