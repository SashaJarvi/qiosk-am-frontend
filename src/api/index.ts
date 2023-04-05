const defaultOptions = () => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
};

const get = (url: string) => fetch(`${import.meta.env.VITE_API_URL}${url}`, defaultOptions());

export default {
  get,
};
