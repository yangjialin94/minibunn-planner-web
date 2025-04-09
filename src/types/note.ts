// Returned by the backend for GET /notes or after POST/PATCH
export type Note = {
  id: number;
  date: string; // ISO 8601 format, e.g. "2025-04-02"
  detail: string;
  order: number;
};

// Payload for creating a new note (POST /notes)
export type NoteCreate = {
  detail?: string;
};

// Payload for updating an existing note (PATCH /notes/:id)
export type NoteUpdate = {
  detail?: string;
  order?: number;
};
