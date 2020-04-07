import { useEffect, useContext, useState } from "react";
import { socketCtx } from "../context/SocketProvider";
import { authCtx } from "../context/AuthProvider";

export default ({ input, setInput }) => {
  const { socket } = useContext(socketCtx);
  const { authUser } = useContext(authCtx);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authUser) {
      socket.on("No such user", () => {
        setErrors({ ...errors, input: "No such user" });
      });
    }
  }, [socket, errors, authUser]);

  const validate = (input) => {
    let errors = {};
    if (input.length === 0) {
      errors.input = "Buddy name required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(input);
    if (Object.keys(validationErrors).length === 0) {
      socket.emit("add buddy", authUser, input);
    } else {
      setErrors({ ...errors, ...validationErrors });
    }
    setInput("");
  };
  return { handleSubmit, errors, setErrors };
};
