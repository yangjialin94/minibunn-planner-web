import { NEXT_PUBLIC_API_URL } from "@/env";
import { User } from "@/types/user";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch current user data.
 */
export async function fetchUser(): Promise<User> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/users/get_current`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
