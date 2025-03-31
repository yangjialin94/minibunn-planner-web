import { Journal, Task } from "@/types/task";

// Mock tasks data
export const tasks: Task[] = [
  {
    id: 1,
    userId: 1,
    name: "Buy Groceries",
    note: "Remember to pick up milk, eggs, and bread.",
    date: new Date("2025-03-28T10:00:00"),

    isCompleted: false,
  },
  {
    id: 2,
    userId: 1,
    name: "Morning Exercise",
    note: "Jog for 30 minutes.",
    date: new Date("2025-03-28T06:30:00"),
    isCompleted: true,
  },
  {
    id: 3,
    userId: 1,
    name: "Team Meeting",
    note: "Discuss project updates with the team.",
    date: new Date("2025-03-28T14:00:00"),
    isCompleted: false,
  },
  {
    id: 4,
    userId: 1,
    name: "Family Breakfast",
    note: "Enjoy breakfast with family.",
    date: new Date("2025-03-23T08:00:00"),
    isCompleted: false,
  },
  {
    id: 5,
    userId: 1,
    name: "Office Meeting",
    note: "Weekly planning meeting.",
    date: new Date("2025-03-24T10:00:00"),
    isCompleted: false,
  },
  {
    id: 6,
    userId: 1,
    name: "Client Call",
    note: "Discuss project details.",
    date: new Date("2025-03-25T14:00:00"),
    isCompleted: false,
  },
  {
    id: 7,
    userId: 1,
    name: "Code Review",
    note: "Review the latest commits.",
    date: new Date("2025-03-26T10:30:00"),
    isCompleted: true,
  },
  {
    id: 8,
    userId: 1,
    name: "Team Sync",
    note: "Quick sync-up with the team.",
    date: new Date("2025-03-27T09:30:00"),
    isCompleted: false,
  },
  {
    id: 9,
    userId: 1,
    name: "Evening Walk",
    note: "Relax with an evening walk after dinner.",
    date: new Date("2025-03-29T18:00:00"),
    isCompleted: false,
  },
  {
    id: 10,
    userId: 1,
    name: "Dinner with Hanwen",
    note: "Find a hotpot place.",
    date: new Date("2025-03-30T18:00:00"),
    isCompleted: false,
  },
];

// Mock journal data
export const journals: Journal[] = [
  {
    id: 1,
    userId: 1,
    date: new Date("2025-03-29T10:00:00"),
    subject: "Good Old Days",
    entry:
      "Super happy to met with old friends we used to hangout with all the time back in Chicago!\nNeed to do this more often!",
  },
];
