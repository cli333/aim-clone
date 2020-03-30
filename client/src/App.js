import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io();

function App() {
  useEffect(() => {
    return () => socket.close();
  }, []);

  useEffect(() => {
    socket.on("chat message", response => {
      console.log(response);
    });
  });

  const [message, setMessage] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    socket.emit("chat message", message);
    setMessage("");
  };

  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <input
          placeholder="send message"
          onChange={e => setMessage(e.target.value)}
          value={message}
        />
      </form>
    </div>
  );
}

export default App;
