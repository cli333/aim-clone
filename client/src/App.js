import React, { useContext } from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { positionCtx } from "./context/PositionProvider";

export default () => {
  const { positions } = useContext(positionCtx);
  return (
    <React.Fragment>
      <SignOnWindow />
      <BuddyWindow />
      {positions.length > 0 && positions.map(position => <ChatWindow />)}
    </React.Fragment>
  );
};
