import { AxiosError } from "axios";

export const getApiErrorMessage = (err: unknown, fallback = "Something went wrong."): string => {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as { message?: string };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
};
