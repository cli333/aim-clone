import useCancellablePromises from "./useCancellablePromises";
import { cancellablePromise, delay } from "../utils/utils";

export default (onClick, onDoubleClick) => {
  const {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  } = useCancellablePromises();

  /* 
    wait for 300 ms
    if no second click, handle single click
    else handle double click
  */

  const handleClick = (idx) => {
    clearPendingPromises();
    const waitForClick = cancellablePromise(delay(300));
    appendPendingPromise(waitForClick);

    return waitForClick.promise
      .then(() => {
        removePendingPromise(waitForClick);
        onClick(idx);
      })
      .catch((err) => {
        removePendingPromise(waitForClick);
        if (!err.isCancelled) throw err.error;
      });
  };

  const handleDoubleClick = () => {
    clearPendingPromises();
    onDoubleClick();
  };

  return { handleClick, handleDoubleClick };
};
