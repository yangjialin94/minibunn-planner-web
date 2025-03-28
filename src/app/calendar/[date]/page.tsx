"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays, isSameDay, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { fetchTasksByDate } from "@/api/tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime, parseLocalDate } from "@/lib/dateUtils";

function Header({ date }: { date: Date }) {
  const router = useRouter();

  const formattedDate = formatDateLocalNoTime(date);
  const formattedToday = formatDateLocalNoTime(new Date());
  const isToday = isSameDay(date, new Date());

  return (
    <div
      className={clsx("daily-header", {
        "bg-green-300": isToday,
      })}
    >
      <div className="pl-2 text-lg font-bold">{formattedDate}</div>
      <div className="flex items-center gap-2">
        <button
          className="daily-arrow-btn"
          onClick={() =>
            router.push(`/calendar/${formatDateLocalNoTime(subDays(date, 1))}`)
          }
        >
          <ChevronLeft />
        </button>
        <button
          className="daily-today-btn"
          onClick={() => router.push(`/calendar/${formattedToday}`)}
        >
          Today
        </button>
        <button
          className="daily-arrow-btn"
          onClick={() =>
            router.push(`/calendar/${formatDateLocalNoTime(addDays(date, 1))}`)
          }
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function Tasks({ dateStr }: { dateStr: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksByDate(dateStr),
  });

  if (isLoading) return <div className="p-4">Loading tasks...</div>;

  if (error) {
    console.error(error); // Log the real error
    return <div className="p-4">Error loading tasks.</div>;
  }

  return (
    <div className="grid flex-1 grid-cols-2 gap-4 p-4">
      {data?.tasks.map((task) => <div key={task.id}>{task.name}</div>)}
    </div>
  );
}

function DailyPage() {
  const { date } = useParams();
  const setPage = usePageStore((state) => state.setPage);

  const localDate = parseLocalDate(date);

  // Update sidebar
  useEffect(() => {
    setPage("daily");
  }, [setPage]);

  return (
    <div>
      <Header date={localDate} />
      <Tasks dateStr={date} />
    </div>
  );
}

export default DailyPage;
