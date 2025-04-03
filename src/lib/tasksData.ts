import { Journal } from "@/types/journal";
import { Task } from "@/types/task";

// Mock tasks data
export const tasks: Task[] = [
  {
    id: 1,
    date: "2025-04-02",
    title: "Buy groceries",
    note: "Milk, eggs, bread",
    is_completed: false,
    order: 1,
    repeatable_id: null,
    repeatable_days: null,
  },
  {
    id: 5,
    date: "2025-04-04",
    title: "Write journal",
    note: "Reflect on the day",
    is_completed: false,
    order: 1,
    repeatable_id: "c7e4b877-aea4-4e7f-afcf-2d2051376d91",
    repeatable_days: 3,
  },
  {
    id: 2,
    date: "2025-04-03",
    title: "Workout",
    note: "Leg day at the gym",
    is_completed: false,
    order: 1,
    repeatable_id: null,
    repeatable_days: null,
  },
  {
    id: 4,
    date: "2025-04-03",
    title: "Write journal",
    note: "Reflect on the day",
    is_completed: false,
    order: 2,
    repeatable_id: "c7e4b877-aea4-4e7f-afcf-2d2051376d91",
    repeatable_days: 3,
  },
  {
    id: 3,
    date: "2025-04-02",
    title: "Write journal",
    note: "Reflect on the day",
    is_completed: false,
    order: 2,
    repeatable_id: "c7e4b877-aea4-4e7f-afcf-2d2051376d91",
    repeatable_days: 3,
  },
  {
    id: 6,
    date: "2025-04-02",
    title: "Study React",
    note: "Go through useEffect deep dive",
    is_completed: false,
    order: 3,
    repeatable_id: "508e55d4-b776-464a-9dd0-79ed72e8db6a",
    repeatable_days: 2,
  },
  {
    id: 7,
    date: "2025-04-03",
    title: "Study React",
    note: "Go through useEffect deep dive",
    is_completed: false,
    order: 3,
    repeatable_id: "508e55d4-b776-464a-9dd0-79ed72e8db6a",
    repeatable_days: 2,
  },
];

// Mock journal data
export const journals: Journal[] = [
  {
    id: 1,
    date: "2025-03-29",
    subject: "Good Old Days",
    entry:
      "Super happy to meet with old friends we used to hang out with all the time back in Chicago!\nNeed to do this more often!",
  },
  {
    id: 2,
    date: "2025-03-30",
    subject: "Reflection on Goals",
    entry:
      "Spent some time revisiting my goals for the year.\nI'm a bit behind on fitness, but ahead on learning.",
  },
  {
    id: 3,
    date: "2025-03-31",
    subject: "Solo Adventure",
    entry:
      "Tried hiking alone for the first time. Peaceful but also spooky near the end.\nNot sure I'd do it again without a buddy.",
  },
  {
    id: 4,
    date: "2025-04-01",
    subject: "Tech Dive",
    entry:
      "Finally understood how useEffect cleanup works in React.\nAlso cleaned up my GitHub profile a bit.",
  },
];
