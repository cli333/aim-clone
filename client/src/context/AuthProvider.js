import React, { createContext, useState, useEffect, useContext } from "react";
import { socketCtx } from "./SocketProvider";

export const authCtx = createContext();

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const { socket } = useContext(socketCtx);

  const handleSignOn = ({ screenName, token }) => {
    setAuthUser({ screenName, token });
    localStorage.setItem("ROLdata", JSON.stringify({ screenName, token }));
  };

  const handleSignOut = e => {
    e.preventDefault();
    setAuthUser(null);
    localStorage.removeItem("ROLdata");
    socket.emit("sign out", { screenName: authUser.screenName });
  };

  useEffect(() => {
    const user = localStorage.getItem("ROLdata");
    if (user) {
      setAuthUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    socket.on("signed on", response => handleSignOn(response));
  }, [socket]);

  // useEffect(() => {
  //   return () => localStorage.removeItem("ROLdata");
  // }, []);

  return (
    <authCtx.Provider value={{ authUser, handleSignOut }}>
      {children}
    </authCtx.Provider>
  );
};
