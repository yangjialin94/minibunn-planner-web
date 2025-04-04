// Returned by the backend for GET /journals or after POST/PATCH
export type Journal = {
  id: number;
  date: string;
  subject: string;
  entry: string;
};

// Payload for creating a new journal (POST /journals)
// export type JournalCreate = {
//   date: string;
//   subject?: string;
//   entry?: string;
// };

// Payload for updating an existing journal (PATCH /journals/:id)
export type JournalUpdate = {
  subject?: string;
  entry?: string;
};
