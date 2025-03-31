"use client";

import clsx from "clsx";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";

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
      <div className="pl-2 text-lg font-bold">{formattedDate}</div>
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
function Cells({ calendarDate }: { calendarDate: Date }) {
  const router = useRouter();

  const monthStart = startOfMonth(calendarDate); // first day of the month
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // previous Sunday

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = addDays(startDate, i);
    const dayFormatted = format(day, "d");
    const isCurrentMonth = isSameMonth(day, monthStart);
    const isToday = isSameDay(day, new Date());

    cells.push(
      <div
        key={day.toString()}
        className="relative aspect-square cursor-pointer border border-neutral-200 hover:bg-neutral-100"
        onClick={() => router.push(`/calendar/${format(day, "yyyy-MM-dd")}`)}
      >
        <div
          className={clsx(
            "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full border p-2 text-sm",
            { "border-neutral-300 text-neutral-300": !isCurrentMonth },
            { "border-neutral-800 text-neutral-800": isCurrentMonth },
            { "bg-green-300 font-bold": isToday },
          )}
        >
          {dayFormatted}
        </div>
      </div>,
    );
  }

  return <div className="cal-cells">{cells}</div>;
}

function Calendar() {
  const calendarDate = usePageStore((state) => state.calendarDate);
  const setCalendarDate = usePageStore((state) => state.setCalendarDate);

  return (
    <div className="scrollable-content">
      <Header calendarDate={calendarDate} setCalendarDate={setCalendarDate} />
      <Days calendarDate={calendarDate} />
      <Cells calendarDate={calendarDate} />
    </div>
  );
}

export default Calendar;
