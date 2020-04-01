import React, { useContext } from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { chatWindowsCtx } from "./context/ChatWindowsProvider";

export default () => {
  const { buddies } = useContext(chatWindowsCtx);
  return (
    <React.Fragment>
      <SignOnWindow />
      <BuddyWindow />
      {buddies.length > 0 && buddies.map(buddy => <ChatWindow {...buddy} />)}
    </React.Fragment>
  );
};
