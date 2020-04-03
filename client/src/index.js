import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ChatWindowsProvider from "./context/ChatWindowsProvider";
import AuthProvider from "./context/AuthProvider";
import SocketProvider from "./context/SocketProvider";
import BuddyProvider from "./context/BuddyProvider";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <AuthProvider>
        <BuddyProvider>
          <ChatWindowsProvider>
            <App />
          </ChatWindowsProvider>
        </BuddyProvider>
      </AuthProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
