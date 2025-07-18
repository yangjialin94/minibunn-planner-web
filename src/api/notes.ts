import { NEXT_PUBLIC_API_URL } from "@/env";
import { Note, NoteUpdate } from "@/types/note";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch a note or create a new one if it doesn't exist.
 */
export async function fetchOrCreateNoteByDate(dateStr: string): Promise<Note> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/?date=${dateStr}`);
  if (!res.ok) throw new Error(`Failed to fetch or create note for ${dateStr}`);
  return res.json();
}

/**
 * Update an existing note.
 */
export async function updateNote(
  noteId: number,
  updates: NoteUpdate,
): Promise<Note> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}
