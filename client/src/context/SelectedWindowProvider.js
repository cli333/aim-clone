import React, { createContext, useState } from "react";

export const selectedWindowCtx = createContext();

export default ({ children }) => {
  const [anotherSelected, setAnotherSelected] = useState(false);

  return (
    <selectedWindowCtx
      value={{
        anotherSelected,
        setAnotherSelected
      }}
    >
      {children}
    </selectedWindowCtx>
  );
};
