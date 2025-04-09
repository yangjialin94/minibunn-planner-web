import Cookies from "js-cookie";

/**
 * A utility function to make API requests with default headers.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = Cookies.get("token");
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
