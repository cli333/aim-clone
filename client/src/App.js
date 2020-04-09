import React, { useContext } from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import { chatWindowsCtx } from "./context/ChatWindowsProvider";
import { authCtx } from "./context/AuthProvider";

export default () => {
  const { authUser } = useContext(authCtx);
  const { chatWindows } = useContext(chatWindowsCtx);

  return (
    <React.Fragment>
      <SignOnWindow />
      {authUser && <BuddyWindow />}
      {authUser && chatWindows.length > 0
        ? chatWindows.map((window, idx) => <ChatWindow key={idx} {...window} />)
        : null}
    </React.Fragment>
  );
};
