import React, { useContext } from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { chatWindowsCtx } from "./context/ChatWindowsProvider";
import { authCtx } from "./context/AuthProvider";

export default () => {
  const { authUser } = useContext(authCtx);
  const { buddies } = useContext(chatWindowsCtx);

  return (
    <React.Fragment>
      <SignOnWindow />
      {authUser && <BuddyWindow />}
      {buddies.length > 0 && buddies.map(buddy => <ChatWindow {...buddy} />)}
    </React.Fragment>
  );
};
