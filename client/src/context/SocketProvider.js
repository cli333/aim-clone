import React, { createContext, useEffect } from "react";
import io from "socket.io-client";

export const socketCtx = createContext();

export default ({ children }) => {
  let socket;

  useEffect(() => {
    socket = io();
    return () => socket.close();
  }, []);

  return <socketCtx value={{ socket }}>{children}</socketCtx>;
};
