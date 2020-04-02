import React, { createContext, useEffect } from "react";
import io from "socket.io-client";

export const socketCtx = createContext();

let socket = io();

export default ({ children }) => {
  useEffect(() => {
    return () => socket.close();
  }, []);

  return <socketCtx.Provider value={{ socket }}>{children}</socketCtx.Provider>;
};
