import React, { createContext, useState, useEffect } from "react";

export const authCtx = createContext();

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

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

  // useEffect(() => {
  //   return () => localStorage.removeItem("ROLdata");
  // }, []);

  return (
    <authCtx.Provider value={{ authUser, handleSignOn, handleSignOut }}>
      {children}
    </authCtx.Provider>
  );
};
