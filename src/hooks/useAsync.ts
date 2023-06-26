import { useCallback, useState } from "react";

const useAsync = <T extends any[]>(
  handleFunction: (...args: T) => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: Parameters<typeof handleFunction>) => {
      setIsLoading(true);
      try {
        await handleFunction(...args);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, handleFunction]
  );

  return { isLoading, execute };
};

export { useAsync };
