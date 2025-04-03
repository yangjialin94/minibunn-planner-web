import { Journal, JournalCreate, JournalUpdate } from "@/types/journal";
import API_BASE_URL from "@/utils/api";

// 🧠 Get or create journal for a given date
export async function fetchOrCreateJournalByDate(
  dateStr: string,
): Promise<Journal> {
  const res = await fetch(`${API_BASE_URL}/journals?date=${dateStr}`);
  if (!res.ok)
    throw new Error(`Failed to fetch or create journal for ${dateStr}`);
  return res.json();
}

// ✍️ Create a new journal (only if not exists already)
export async function createJournal(journal: JournalCreate): Promise<Journal> {
  const res = await fetch(`${API_BASE_URL}/journals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journal),
  });
  if (!res.ok) throw new Error("Failed to create journal");
  return res.json();
}

// 🔧 Update an existing journal
export async function updateJournal(
  journalId: number,
  updates: JournalUpdate,
): Promise<Journal> {
  const res = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update journal");
  return res.json();
}
