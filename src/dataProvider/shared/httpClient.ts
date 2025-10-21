import { fetchUtils, HttpError } from "react-admin";

export const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  options.headers = new Headers({
    Accept: "application/json",
  });
  const response = fetchUtils.fetchJson(url, options).catch((error) => {
    if (error instanceof HttpError) {
      const message =
        error.body[0]?.message || error.message || "Unknown error";
      return Promise.reject(new HttpError(message, error.status));
    }
    return Promise.reject(error);
  });

  return response;
};
