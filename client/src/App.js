import React from "react";
import "./App.css";
import SignOnWindow from "./components/SignOnWindow/SignOnWindow";
import BuddyWindow from "./components/BuddyWindow/BuddyWindow";

export default () => {
  return (
    <div>
      <SignOnWindow />
      <BuddyWindow />
    </div>
  );
};
