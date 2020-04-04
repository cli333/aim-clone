import { useState, useContext, useEffect } from "react";
import { socketCtx } from "../context/SocketProvider";

export default ({ screenName, setScreenName, password, setPassword }) => {
  const [errors, setErrors] = useState({});
  const { socket } = useContext(socketCtx);

  useEffect(() => {
    socket.on("Incorrect password", () => {
      setErrors({ ...errors, password: "Incorrect password" });
    });
    socket.on("User already logged in", () => {
      setErrors({ ...errors, screenName: "User already logged in" });
    });
  }, [socket, errors]);

  const validate = (screenName, password) => {
    let errors = {};
    if (!screenName) {
      errors.screenName = "Screen name required";
    }
    if (!password) {
      errors.password = "Password required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(screenName, password);
    if (Object.keys(validationErrors).length === 0) {
      socket.emit("sign on", { screenName, password });
    } else {
      setErrors(validationErrors);
    }
    setScreenName("");
    setPassword("");
  };

  return {
    errors,
    setErrors,
    handleSubmit,
  };
};
