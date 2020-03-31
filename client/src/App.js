import React from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";
import ChatWindow from "./components/ChatWindow/ChatWindow";

export default () => {
  return (
    <div>
      <SignOnWindow />
      <BuddyWindow />
      <ChatWindow />
    </div>
  );
};
