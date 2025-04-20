import type { User as FirebaseUser } from "firebase/auth";

import { auth } from "@/auth/firebaseClient";

/**
 * A utility function to wait for the user to be authenticated.
 * It will retry 5 times with a 500ms delay between attempts.
 */
export async function waitForUser(
  maxRetries = 10,
  delayMs = 500,
): Promise<FirebaseUser> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const user = auth.currentUser;
    if (user) return user;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  // As a final fallback, use onAuthStateChanged to avoid false negatives
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) resolve(user);
      else reject(new Error("User not signed in"));
    });
  });
}

/**
 * A utility function to make API requests with default headers.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  // Get the current token
  const user = auth.currentUser || (await waitForUser());
  const token = await user.getIdToken();

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
