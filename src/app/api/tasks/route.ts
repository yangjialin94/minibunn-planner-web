import { Task } from "@/types/task";

export const tasks: Task[] = [
  {
    id: 1,
    name: "Buy Groceries",
    note: "Remember to pick up milk, eggs, and bread.",
    dueDate: new Date("2025-03-28T10:00:00"),
    isDaily: false,
    startDate: new Date("2025-03-28T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 2,
    name: "Morning Exercise",
    note: "Jog for 30 minutes.",
    dueDate: new Date("2025-03-28T06:30:00"),
    isDaily: true,
    startDate: new Date("2025-03-28T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: true,
  },
  {
    id: 3,
    name: "Team Meeting",
    note: "Discuss project updates with the team.",
    dueDate: new Date("2025-03-28T14:00:00"),
    isDaily: false,
    startDate: new Date("2025-03-28T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 4,
    name: "Family Breakfast",
    note: "Enjoy breakfast with family.",
    dueDate: new Date("2025-03-23T08:00:00"),
    isDaily: false,
    startDate: new Date("2025-03-23T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 5,
    name: "Office Meeting",
    note: "Weekly planning meeting.",
    dueDate: new Date("2025-03-24T10:00:00"),
    isDaily: false,
    startDate: new Date("2025-03-24T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 6,
    name: "Client Call",
    note: "Discuss project details.",
    dueDate: new Date("2025-03-25T14:00:00"),
    isDaily: false,
    startDate: new Date("2025-03-25T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 7,
    name: "Code Review",
    note: "Review the latest commits.",
    dueDate: new Date("2025-03-26T10:30:00"),
    isDaily: false,
    startDate: new Date("2025-03-26T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: true,
  },
  {
    id: 8,
    name: "Team Sync",
    note: "Quick sync-up with the team.",
    dueDate: new Date("2025-03-27T09:30:00"),
    isDaily: false,
    startDate: new Date("2025-03-27T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
  {
    id: 9,
    name: "Evening Walk",
    note: "Relax with an evening walk after dinner.",
    dueDate: new Date("2025-03-29T18:00:00"),
    isDaily: true,
    startDate: new Date("2025-03-29T00:00:00"),
    endDate: new Date("9999-12-31T00:00:00"),
    isCompleted: false,
  },
];

/**
 * API route to fetch all tasks
 */
export async function GET() {
  return NextResponse.json({ tasks });
}
