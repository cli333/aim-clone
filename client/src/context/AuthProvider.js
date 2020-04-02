import React, { createContext, useState, useEffect, useContext } from "react";
import { socketCtx } from "./SocketProvider";

export const authCtx = createContext();

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  //
  const { socket } = useContext(socketCtx);

  const handleSignOn = user => {
    setAuthUser(user);
    localStorage.setItem("ROLdata", JSON.stringify(user));
  };

  const handleSignOut = e => {
    e.preventDefault();
    setAuthUser(null);
    localStorage.removeItem("ROLdata");
  };

  useEffect(() => {
    const user = localStorage.getItem("ROLdata");
    if (user) {
      setAuthUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    socket.on("user sign on", res => console.log(res));
  }, [socket]);

  // useEffect(() => {
  //   return () => localStorage.removeItem("ROLdata");
  // }, []);

  return (
    <authCtx.Provider value={{ authUser, handleSignOn, handleSignOut }}>
      {children}
    </authCtx.Provider>
  );
};
