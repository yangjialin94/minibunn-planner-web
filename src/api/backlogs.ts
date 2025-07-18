import { NEXT_PUBLIC_API_URL } from "@/env";
import { Backlog, BacklogCreate, BacklogUpdate } from "@/types/backlog";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch backlogs.
 */
export async function fetchBacklogs(): Promise<Backlog[]> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/backlogs/`);
  if (!res.ok) throw new Error("Failed to fetch backlogs");
  return res.json();
}

/**
 * Create a new backlog.
 */
export async function createBacklog(data: BacklogCreate): Promise<Backlog> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/backlogs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create backlog");
  return res.json();
}

/**
 * Update an existing backlog.
 * Choices for updates:
 * 1. detail
 * 2. order
 */
export async function updateBacklog(
  backlogId: number,
  updates: BacklogUpdate,
): Promise<Backlog> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/backlogs/${backlogId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update backlog");
  return res.json();
}

/**
 * Delete a backlog.
 */
export async function deleteBacklog(
  backlogId: number,
): Promise<{ message: string }> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/backlogs/${backlogId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete backlog");
  return res.json();
}
