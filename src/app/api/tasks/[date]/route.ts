import { NextResponse } from "next/server";

import { formatDateLocalNoTime } from "@/lib/dateUtils";

import { tasks } from "../route";

/**
 * API route to fetch tasks for a specific day
 */
export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  const awaitedParams = await Promise.resolve(params);
  const { date } = awaitedParams;

  const filteredTasks = tasks.filter((task) => {
    return formatDateLocalNoTime(task.dueDate) === date;
  });

  return NextResponse.json({ tasks: filteredTasks });
}
