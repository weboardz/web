import { useEffect, useRef } from "react";

const usePrevious = <T>(state: T): T => {
  const previousState = useRef(state);

  useEffect(() => {
    previousState.current = state;
  }, [state]);

  return previousState.current;
};

export { usePrevious };
