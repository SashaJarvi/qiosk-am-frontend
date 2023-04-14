const defaultOptions = () => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
};

const get = (url: string) => fetch(`${import.meta.env.VITE_API_URL}${url}`, defaultOptions());

const post = (url: string, body: unknown) =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "POST",
    body: JSON.stringify(body),
  });

export default {
  get,
  post,
};
