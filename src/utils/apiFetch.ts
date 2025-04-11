import { auth } from "@/auth/firebaseClient";

/**
 * A utility function to make API requests with default headers.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // Get the current token
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  if (!token) {
    throw new Error("No Firebase token available");
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });
}
