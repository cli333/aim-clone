import { useContext } from "react";
import { authCtx } from "../context/AuthProvider";
import { socketCtx } from "../context/SocketProvider";

export default ({ messageInput, receiver, setMessageInput, room }) => {
  const { authUser } = useContext(authCtx);
  const { socket } = useContext(socketCtx);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageObj = {
      sender: `${authUser.id};${authUser.screenName}`,
      receiver,
      room,
      message: messageInput,
      token: authUser.token,
    };
    socket.emit("send message", messageObj);
    setMessageInput("");
  };

  return { handleSubmit };
};
