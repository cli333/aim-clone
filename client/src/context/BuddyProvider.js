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
    socket.on("Updated online users", (onlineUsers) =>
      console.log(onlineUsers)
    );
  }, [socket]);

  return (
    <buddyCtx.Provider value={{ offlineBuddies, onlineBuddies }}>
      {children}
    </buddyCtx.Provider>
  );
};
