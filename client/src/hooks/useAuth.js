import { useState, useContext } from "react";
import axios from "axios";
import { authCtx } from "../context/AuthProvider";

export default ({ screenName, setScreenName, password, setPassword }) => {
  const [errors, setErrors] = useState({});
  const { handleSignOn } = useContext(authCtx);

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

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate(screenName, password);
    if (Object.keys(validationErrors).length === 0) {
      axios.post("/auth", { screenName, password }).then(res => {
        if (res.data.token) {
          const user = { screenName, ...res.data };
          handleSignOn(user);
        } else {
          setErrors(res.data);
        }
      });
    } else {
      setErrors(validationErrors);
    }
    setScreenName("");
    setPassword("");
  };

  return {
    errors,
    setErrors,
    handleSubmit
  };
};
