import { useRef } from "react";

export default () => {
  const pendingPromises = useRef([]);

  /* 
    append promise
  */

  const appendPendingPromise = (promise) =>
    (pendingPromises.current = [...pendingPromises.current, promise]);

  /* 
    remove promise
  */

  const removePendingPromise = (promise) =>
    (pendingPromises.current = pendingPromises.current.filter(
      (p) => p !== promise
    ));

  /* 
      clear promises
  */

  const clearPendingPromises = () =>
    pendingPromises.current.map((promise) => promise.cancel());

  return {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  };
};
