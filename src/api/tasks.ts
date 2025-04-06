import { Task, TaskCompletion, TaskCreate, TaskUpdate } from "@/types/task";
import API_BASE_URL from "@/utils/api";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch tasks for a specific date or date range.
 * Example for 2025-04-03: `/tasks/?start=2025-04-03&end=2025-04-03`
 * Example for 2025-04-03 to 2025-04-05: `/tasks/?start=2025-04-03&end=2025-04-05`
 */
export async function fetchTasksInRange(
  start: string,
  end: string,
): Promise<Task[]> {
  const res = await apiFetch(
    `${API_BASE_URL}/tasks/?start=${start}&end=${end}`,
  );
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

/**
 * Create a new task or repeatable tasks.
 */
export async function createTask(data: TaskCreate): Promise<Task> {
  const res = await apiFetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

/**
 * Update an existing task or repeatable tasks.
 * Choices for updates:
 * 1. title / note
 * 2. is_completed
 * 3. order
 */
export async function updateTask(
  taskId: number,
  updates: TaskUpdate,
): Promise<Task> {
  const res = await apiFetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

/**
 * Delete a task or repeatable tasks.
 */
export async function deleteTask(taskId: number): Promise<{ message: string }> {
  const res = await apiFetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

/**
 * Fetch tasks completion for a specific date or date range.
 */
export async function fetchTasksCompletionInRange(
  start: string,
  end: string,
): Promise<TaskCompletion[]> {
  const res = await apiFetch(
    `${API_BASE_URL}/tasks/completion/?start=${start}&end=${end}`,
  );
  if (!res.ok) throw new Error("Failed to fetch tasks completion");
  return res.json();
}
