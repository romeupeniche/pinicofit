import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";
let previousTouchAction = "";

export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      previousTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(lockCount - 1, 0);
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
        document.body.style.touchAction = previousTouchAction;
      }
    };
  }, [locked]);
};
