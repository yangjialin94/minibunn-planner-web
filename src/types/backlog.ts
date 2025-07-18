// Returned by the backend for GET /backlogs or after POST/PATCH
export type Backlog = {
  id: number;
  date: string; // ISO 8601 format, e.g. "2025-04-02"
  detail: string;
  order: number;
};

// Payload for creating a new backlog (POST /backlogs)
export type BacklogCreate = {
  detail?: string;
};

// Payload for updating an existing backlog (PATCH /backlogs/:id)
export type BacklogUpdate = {
  detail?: string;
  order?: number;
};
