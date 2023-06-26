import { useEffect, useRef } from "react";

const useToken = () => {
  const config = useRef<{ headers: { Authorization: string } }>();

  useEffect(() => {
    const token = document.cookie.replace("token=", "");
    config.current = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;
  }, []);

  return config.current;
};

export { useToken };
