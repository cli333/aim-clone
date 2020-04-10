import React, { createContext, useState, useEffect, useContext } from "react";
import { socketCtx } from "./SocketProvider";

export const authCtx = createContext();

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const { socket } = useContext(socketCtx);

  const handleSignOn = (authObj) => {
    setAuthUser(authObj);
  };

  const handleSignOut = (e) => {
    if (e) e.preventDefault();
    setAuthUser(null);
    socket.emit("sign out", {
      screenName: authUser.screenName,
      id: authUser.id,
    });
  };

  useEffect(() => {
    socket.on("Signed on", (response) => handleSignOn(response));
  }, [socket]);

  return (
    <authCtx.Provider value={{ authUser, handleSignOut }}>
      {children}
    </authCtx.Provider>
  );
};
