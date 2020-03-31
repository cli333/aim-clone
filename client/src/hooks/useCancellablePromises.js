import { useRef } from "react";

export default () => {
  const pendingPromises = useRef([]);

  const appendPendingPromise = promise =>
    (pendingPromises.current = [...pendingPromises.current, promise]);

  const removePendingPromise = promise =>
    (pendingPromises.current = pendingPromises.current.filter(
      p => p !== promise
    ));

  const clearPendingPromises = () =>
    pendingPromises.current.map(promise => promise.cancel());

  return {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises
  };
};
