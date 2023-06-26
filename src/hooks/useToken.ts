const useToken = () => {
  if (typeof document !== "undefined") {
    const token = document.cookie.replace("token=", "");
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;
  }
};

export { useToken };
