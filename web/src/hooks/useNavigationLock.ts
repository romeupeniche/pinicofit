import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

interface PreventNavigationProps {
  hasChanges: boolean;
  isLoading?: boolean;
}

export const useNavigationLock = ({
  hasChanges,
  isLoading,
}: PreventNavigationProps) => {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return !!(
      (hasChanges || isLoading) &&
      currentLocation.pathname !== nextLocation.pathname
    );
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges || isLoading) {
        e.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isLoading]);

  return blocker;
};
