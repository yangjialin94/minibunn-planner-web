import { NextResponse } from "next/server";

import { formatDateLocalNoTime } from "@/lib/dateUtils";
import { tasks } from "@/lib/tasksData";

/**
 * API route to fetch tasks for a specific day
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  const awaitedParams = await Promise.resolve(params);
  const { date } = awaitedParams;

  const filteredTasks = tasks.filter((task) => {
    return formatDateLocalNoTime(task.dueDate) === date;
  });

  return NextResponse.json({ tasks: filteredTasks });
}
