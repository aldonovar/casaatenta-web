"use client";

import { useEffect } from "react";

let activeLocks = 0;
let restore:
  | {
      overflow: string;
      paddingRight: string;
      overscrollBehavior: string;
    }
  | undefined;

function acquireBodyScrollLock() {
  activeLocks += 1;

  if (activeLocks === 1) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    restore = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };

    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks === 0 && restore) {
      document.body.style.overflow = restore.overflow;
      document.body.style.paddingRight = restore.paddingRight;
      document.documentElement.style.overscrollBehavior = restore.overscrollBehavior;
      restore = undefined;
    }
  };
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    return acquireBodyScrollLock();
  }, [locked]);
}
