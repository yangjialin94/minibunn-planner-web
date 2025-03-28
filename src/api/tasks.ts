import { Task } from "@/types/task";

// Fetch all tasks from the API
export async function fetchTasks(): Promise<{ tasks: Task[] }> {
  const res = await fetch("/api/tasks");
  console.log(res.status, res.statusText);

  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// Fetch tasks by date from the API
export async function fetchTasksByDate(
  dateStr: string,
): Promise<{ tasks: Task[] }> {
  const res = await fetch(`/api/tasks/${dateStr}`);
  if (!res.ok) throw new Error(`Failed to fetch tasks for ${dateStr}`);

  return res.json();
}
