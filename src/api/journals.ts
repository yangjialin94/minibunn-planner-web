import { Journal, JournalUpdate } from "@/types/journal";
import { apiFetch } from "@/utils/apiFetch";

// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch a journal or create a new one if it doesn't exist.
 */
export async function fetchOrCreateJournalByDate(
  dateStr: string,
): Promise<Journal> {
  const res = await apiFetch(`${apiUrl}/journals/?date=${dateStr}`);
  if (!res.ok)
    throw new Error(`Failed to fetch or create journal for ${dateStr}`);
  return res.json();
}

/**
 * Create a empty new journal.
 */
// export async function createJournal(journal: JournalCreate): Promise<Journal> {
//   const res = await fetch(`${apiUrl}/journals`, {
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
  const res = await apiFetch(`${apiUrl}/journals/${journalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update journal");
  return res.json();
}
