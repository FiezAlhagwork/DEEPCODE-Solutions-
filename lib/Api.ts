import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

api.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      success: false;
      error?: { message: string; code?: string };
    }>
  ) => {
    if (error.response) {
      const backendError = error.response.data?.error;
      throw new ApiError(
        backendError?.message ?? "Something went wrong",
        backendError?.code,
        error.response.status
      );
    }
    if (error.request) {
      throw new ApiError("Could not reach the server. Check your connection.");
    }
    throw new ApiError(error.message);
  }
);
