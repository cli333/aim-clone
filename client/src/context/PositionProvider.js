import React, { createContext, useState } from "react";

export const positionCtx = createContext();

export default ({ children }) => {
  const [positions, setPositions] = useState({});
  const [lastPosition, setLastPosition] = useState({ x: 750, y: -1000 });

  const handleNewWindowPosition = () => {
    const newPosition = Object.assign(lastPosition, {
      x: lastPosition.x + 25,
      y: lastPosition.y + 25
    });
    setPositions({ ...positions, newPosition });
    setLastPosition(newPosition);
  };

  return (
    <positionCtx.Provider value={{ positions, handleNewWindowPosition }}>
      {children}
    </positionCtx.Provider>
  );
};
