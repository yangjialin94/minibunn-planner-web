"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays, isSameDay, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { fetchTasksByDate } from "@/api/tasks";
import TaskCard from "@/components/task/TaskCard";
import TaskFilter from "@/components/task/TaskFilter";
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

function StatusBar({ dateStr }: { dateStr: string }) {
  return (
    <div className="flex justify-between p-4">
      <div>
        <TaskFilter />
      </div>
      <div>
        <span className="text-sm font-bold text-gray-500">
          [ Get daily completion status by date ({dateStr}): 1/3 ]
        </span>
      </div>
    </div>
  );
}

function Tasks({ dateStr }: { dateStr: string }) {
  const taskFilter = usePageStore((state) => state.taskFilter);
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksByDate(dateStr),
  });

  if (isLoading) return <div className="p-4">Loading tasks...</div>;

  if (error) {
    console.error(error);
    return <div className="p-4">Error loading tasks.</div>;
  }

  return (
    <div className="grid flex-1 grid-cols-2 gap-4 p-4">
      {data?.tasks.map((task) => {
        if (taskFilter === "completed" && !task.isCompleted) return null;
        if (taskFilter === "incomplete" && task.isCompleted) return null;
        return <TaskCard key={task.id} task={task} />;
      })}
    </div>
  );
}

function DailyPage() {
  const { date } = useParams();
  const setPage = usePageStore((state) => state.setPage);
  const setTaskDate = usePageStore((state) => state.setTaskDate);

  const dateStr = date
    ? Array.isArray(date)
      ? date[0]
      : date
    : formatDateLocalNoTime(new Date());

  // Update page state
  useEffect(() => {
    setPage("daily");
    setTaskDate(dateStr);
  }, [dateStr, setPage, setTaskDate]);

  if (!date) {
    return <div>Error: Date parameter is missing.</div>;
  }

  const localDate = parseLocalDate(dateStr);

  return (
    <div className="scrollable-content">
      <Header date={localDate} />
      <StatusBar dateStr={dateStr} />
      <Tasks dateStr={dateStr} />
    </div>
  );
}

export default DailyPage;
