import { NEXT_PUBLIC_API_URL } from "@/env";
import { Note, NoteCreate, NoteUpdate } from "@/types/note";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch notes.
 */
export async function fetchNotes(): Promise<Note[]> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/`);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

/**
 * Create a new note.
 */
export async function createNote(data: NoteCreate): Promise<Note> {
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/`, {
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
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
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
  const res = await apiFetch(`${NEXT_PUBLIC_API_URL}/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}
