import { Journal } from "@/types/task";

// Fetch all journals from the API
export async function fetchJournals(): Promise<{ journals: Journal[] }> {
  const res = await fetch("/api/journals");
  console.log(res.status, res.statusText);

  if (!res.ok) throw new Error("Failed to fetch journals");
  return res.json();
}

// Fetch journal by date from the API
export async function fetchJournalByDate(
  dateStr: string,
): Promise<{ journal: Journal }> {
  const res = await fetch(`/api/journals/${dateStr}`);
  if (!res.ok) throw new Error(`Failed to fetch journal for ${dateStr}`);

  return res.json();
}
