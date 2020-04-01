import React, { useState, useContext, useEffect } from "react";
import { authCtx } from "./AuthProvider";

export const buddyCtx = useContext();

export default ({ children }) => {
  const [buddies, setBuddies] = useState([]);
  const { authUser } = useContext(authCtx);

  useEffect(() => {
    if (authUser) {
      // get buddies
    }
  }, [authUser]);

  return <buddyCtx.Provider value={{ buddies }}>{children}</buddyCtx.Provider>;
};
