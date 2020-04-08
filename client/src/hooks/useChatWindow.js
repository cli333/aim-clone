import { useEffect, useContext } from "react";
import { authCtx } from "../context/AuthProvider";
import { socketCtx } from "../context/SocketProvider";

export default ({ message, receiver, setMessage }) => {
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageObj = { sender: authUser, receiver, message };
    socket.emit("send message", messageObj);
    setMessage("");
  };

  return { handleSubmit };
};
