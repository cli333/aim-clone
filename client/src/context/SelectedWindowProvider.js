import React, { createContext, useState } from "react";

export const selectedWindowCtx = createContext();

export default ({ children }) => {
  const [anotherSelected, setAnotherSelected] = useState(false);

  const selectWindow = () => {};

  return (
    <selectedWindowCtx
      value={{
        selectWindow,
      }}
    >
      {children}
    </selectedWindowCtx>
  );
};
