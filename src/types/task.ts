// Returned by the backend for GET /tasks or after POST/PATCH
export type Task = {
  id: number;
  date: string; // ISO 8601 format, e.g. "2025-04-02"
  title: string;
  note: string;
  is_completed: boolean;
  order: number;
  repeatable_id: string | null;
  repeatable_days: number | null;
};

// Payload for creating a new task (POST /tasks)
export type TaskCreate = {
  date: string;
  title?: string;
  note?: string;
  is_completed?: boolean;
  repeatable_id?: string | null;
  repeatable_days?: number | null;
};

// Payload for updating an existing task (PATCH /tasks/:id)
export type TaskUpdate = {
  title?: string;
  note?: string;
  is_completed?: boolean;
  order?: number;
};
