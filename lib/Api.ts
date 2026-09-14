import axios, { AxiosError } from "axios";
import { getClerkToken } from "./ClerkTokenBridge";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attaches the signed-in user's Clerk session token to every request — what
// makes the feature hooks (`useProjects`, `useCategories`, `useUsers`, …)
// actually authenticate once someone is signed in, since every admin
// mutation the backend exposes requires it. `getClerkToken()` resolves to
// `null` on the server and before `ClerkTokenSync` has mounted client-side —
// both cases just send the request unauthenticated, same as signed out.
// Server-side calls (only `getMyProfile` in `app/[locale]/admin/layout.tsx`
// today) pass their own token explicitly per-request instead, since there's
// no client component tree to read it from there.
api.interceptors.request.use(async (config) => {
  const token = await getClerkToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
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
