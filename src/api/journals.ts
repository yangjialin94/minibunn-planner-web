import { NEXT_PUBLIC_API_URL } from "@/env";
import { Journal, JournalUpdate } from "@/types/journal";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch a journal or create a new one if it doesn't exist.
 */
export async function fetchOrCreateJournalByDate(
  dateStr: string,
): Promise<Journal> {
  const res = await apiFetch(
    `${NEXT_PUBLIC_API_URL}/journals/?date=${dateStr}`,
  );
  if (!res.ok)
    throw new Error(`Failed to fetch or create journal for ${dateStr}`);
  return res.json();
}

/**
 * Create a empty new journal.
 */
// export async function createJournal(journal: JournalCreate): Promise<Journal> {
//   const res = await fetch(`${NEXT_PUBLIC_API_URL}/journals`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(journal),
//   });
//   if (!res.ok) throw new Error("Failed to create journal");
//   return res.json();
// }

/**
 * Update an existing journal.
 */
export async function updateJournal(
  journalId: number,
  updates: JournalUpdate,
): Promise<Journal> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/journals/${journalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update journal");
  return res.json();
}
