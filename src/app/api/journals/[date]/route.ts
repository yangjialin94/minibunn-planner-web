import { NextResponse } from "next/server";

import { formatDateLocalNoTime } from "@/lib/dateUtils";
import { journals } from "@/lib/tasksData";

/**
 * API route to fetch journal for a specific day
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, { params }: any) {
  const awaitedParams = await Promise.resolve(params);
  const { date } = awaitedParams;

  const filteredJournals = journals.filter((journal) => {
    return formatDateLocalNoTime(journal.date) === date;
  });

  return NextResponse.json({ journal: filteredJournals[0] });
}
