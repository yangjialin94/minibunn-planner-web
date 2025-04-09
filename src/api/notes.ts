import { Note, NoteCreate, NoteUpdate } from "@/types/note";
import { apiFetch } from "@/utils/apiFetch";

// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch notes.
 */
export async function fetchNotes(): Promise<Note[]> {
  const res = await apiFetch(`${apiUrl}/notes`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

/**
 * Create a new note.
 */
export async function createNote(data: NoteCreate): Promise<Note> {
  const res = await apiFetch(`${apiUrl}/notes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

/**
 * Update an existing note.
 * Choices for updates:
 * 1. detail
 * 2. order
 */
export async function updateNote(
  noteId: number,
  updates: NoteUpdate,
): Promise<Note> {
  const res = await apiFetch(`${apiUrl}/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

/**
 * Delete a note.
 */
export async function deleteNote(noteId: number): Promise<{ message: string }> {
  const res = await apiFetch(`${apiUrl}/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}
