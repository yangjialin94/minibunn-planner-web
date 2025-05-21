import { NEXT_PUBLIC_API_URL } from "@/env";
import { User, UserUpdate } from "@/types/user";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch current user data.
 */
export async function fetchUser(): Promise<User> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/users/get_current`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

/**
 * Update user data.
 */
export async function updateUser(
  userId: number,
  updates: UserUpdate,
): Promise<User> {
  console.log("updateUser", userId, updates);
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
