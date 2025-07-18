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
import React from "react";

import { fetchTasksCompletionInRange } from "@/api/tasks";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { usePageStore } from "@/hooks/usePageStore";
import { TaskCompletion } from "@/types/task";

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
          <ChevronLeft size={20} />
        </button>
        <button className="cal-btn" onClick={() => setCalendarDate(new Date())}>
          Today
        </button>
        <button
          className="cal-arrow-btn"
          onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
        >
          <ChevronRight size={20} />
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
  const today = usePageStore((state) => state.today);

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
        className="cal-cell"
        onClick={() => {
          router.push(`/calendar/${dateStr}`);
        }}
      >
        <div
          className={clsx("cal-day-number", {
            today: isToday,
            "current-month": isCurrentMonth && !isToday,
            "other-month": !isCurrentMonth && !isToday,
          })}
        >
          {dayFormatted}
        </div>
        {summary && (
          <div className="cal-mini-progress-container">
            <div
              className={clsx("cal-mini-progress-fill", {
                completed: summary.completed === summary.total,
                "in-progress": summary.completed < summary.total,
              })}
              style={{
                width: `${(summary.completed / summary.total) * 100}%`,
              }}
            />
          </div>
        )}
      </div>,
    );
  }

  return (
    <div
      className={clsx("cal-cells", {
        "cal-cells-6": showSixthWeek,
        "cal-cells-5": !showSixthWeek,
      })}
    >
      {cells}
    </div>
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

      <Cells calendarDate={calendarDate} completions={completions} />
    </>
  );
}

export default Calendar;
