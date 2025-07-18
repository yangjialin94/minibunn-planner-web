// Returned by the backend for GET /notes or after POST/PATCH
export type Note = {
  id: number;
  date: string;
  entry: string;
};

// Payload for updating an existing note (PATCH /notes/:id)
export type NoteUpdate = {
  entry?: string;
};
