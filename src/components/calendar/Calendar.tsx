"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  addDays,
  addMonths,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { fetchTasksCompletionInRange } from "@/api/tasks";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { usePageStore } from "@/hooks/usePageStore";
import { TaskCompletion } from "@/types/task";
import { formatDateLocalNoTime } from "@/utils/date";

/**
 * Header component for the calendar
 */
function Header({
  calendarDate,
  setCalendarDate,
}: {
  calendarDate: Date;
  setCalendarDate: (date: Date) => void;
}) {
  const formattedDate = format(calendarDate, "MMMM yyyy");

  return (
    <div className="cal-header">
      <h2 className="pl-2">{formattedDate}</h2>
      <div className="flex items-center gap-2">
        <button
          className="cal-arrow-btn"
          onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
        >
          <ChevronLeft />
        </button>
        <button className="cal-btn" onClick={() => setCalendarDate(new Date())}>
          Today
        </button>
        <button
          className="cal-arrow-btn"
          onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

/**
 * Render the days of the week (Sun, Mon, …)
 */
function Days({ calendarDate }: { calendarDate: Date }) {
  const days = [];
  const startDate = startOfWeek(calendarDate, { weekStartsOn: 0 });

  for (let i = 0; i < 7; i++) {
    days.push(
      <div key={i} className="flex-1 text-center">
        {format(addDays(startDate, i), "EEE")}
      </div>,
    );
  }
  return <div className="cal-days">{days}</div>;
}

/**
 * Render the cells of the calendar
 */
function Cells({
  calendarDate,
  completions,
}: {
  calendarDate: Date;
  completions: Record<string, TaskCompletion>;
}) {
  const router = useRouter();

  // Track the current date
  const [today, setToday] = useState(formatDateLocalNoTime(new Date()));

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // set to next midnight

    const msUntilMidnight = midnight.getTime() - now.getTime();

    // Set a timeout to update the date at midnight
    const timeout = setTimeout(() => {
      setToday(formatDateLocalNoTime(new Date()));
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [today]);

  // Get the start date of the month and the previous Sunday
  const monthStart = startOfMonth(calendarDate); // first day of the month
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // previous Sunday

  // Check if the sixth week should be shown
  const sixthWeekStart = addDays(startDate, 35); // day index 35 = Sunday of row 6
  const showSixthWeek = isSameMonth(sixthWeekStart, monthStart);
  const totalCells = showSixthWeek ? 42 : 35;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const day = addDays(startDate, i);
    const dayFormatted = format(day, "d");
    const dateStr = format(day, "yyyy-MM-dd");
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isToday = dateStr === today;
    const summary = completions[dateStr];

    cells.push(
      <div
        key={dateStr}
        className="relative aspect-square cursor-pointer border border-neutral-200 hover:bg-neutral-200"
        onClick={() => {
          router.push(`/calendar/${dateStr}`);
        }}
      >
        <div
          className={clsx(
            "absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-sm md:size-8 md:border lg:top-2 lg:right-2 lg:p-4",
            { "border-neutral-300 text-neutral-300": !isCurrentMonth },
            {
              "border-neutral-800 text-neutral-800": isCurrentMonth && !isToday,
            },
            {
              "border-neutral-800 font-bold text-green-500 md:bg-green-300 md:text-neutral-800":
                isCurrentMonth && isToday,
            },
          )}
        >
          {dayFormatted}
        </div>
        {summary && (
          <div className="absolute bottom-0 left-0 rounded px-1 text-sm font-thin text-neutral-500 sm:text-xl md:text-2xl lg:bottom-2 lg:left-2 lg:text-4xl xl:text-5xl">
            {summary.completed}/{summary.total}
          </div>
        )}
      </div>,
    );
  }

  return (
    <div className={showSixthWeek ? "cal-cells-6" : "cal-cells-5"}>{cells}</div>
  );
}

function Calendar() {
  const calendarDate = usePageStore((state) => state.calendarDate);
  const setCalendarDate = usePageStore((state) => state.setCalendarDate);

  // Fetch tasks completion data for the current month
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = addDays(monthStart, 42);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // previous Sunday
  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(monthEnd, "yyyy-MM-dd");

  console.log(`Fetching tasks completion from ${startStr} to ${endStr}`);

  const { data, error, isLoading } = useQuery<TaskCompletion[]>({
    queryKey: ["tasksCompletion", startStr, endStr],
    queryFn: () => fetchTasksCompletionInRange(startStr, endStr),
  });

  // Transform the data into a dictionary for easier access
  const completions: Record<string, TaskCompletion> = {};
  if (data) {
    data.forEach((item) => {
      completions[item.date] = item;
    });
  }

  // Handle loading and error states
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return <Error />;
  }

  return (
    <>
      <Header calendarDate={calendarDate} setCalendarDate={setCalendarDate} />

      <Days calendarDate={calendarDate} />

      <div className="overflow-y-auto">
        <Cells calendarDate={calendarDate} completions={completions} />
      </div>
    </>
  );
}

export default Calendar;
