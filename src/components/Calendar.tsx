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
import React, { useState } from "react";

/**
 * Header component for the calendar
 */
function Header({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const formattedDate = format(currentDate, "MMMM yyyy");

  return (
    <div className="cal-header">
      <div className="pl-2 text-lg font-bold">{formattedDate}</div>
      <div className="flex items-center gap-2">
        <button
          className="cal-arrow-btn"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft />
        </button>
        <button className="cal-btn" onClick={() => setCurrentDate(new Date())}>
          Today
        </button>
        <button
          className="cal-arrow-btn"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
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
function Days({ currentDate }: { currentDate: Date }) {
  const days = [];
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });

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
function Cells({ currentDate }: { currentDate: Date }) {
  const router = useRouter();

  const monthStart = startOfMonth(currentDate); // first day of the month
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
        className="relative aspect-square cursor-pointer border border-neutral-200 hover:bg-neutral-200"
        onClick={() => router.push(`/calendar/${format(day, "yyyy-MM-dd")}`)}
      >
        <div
          className={clsx(
            "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full border p-2 text-sm",
            { "border-neutral-200 text-neutral-200": !isCurrentMonth },
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
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="scrollbar-thin h-full w-full overflow-y-scroll border-neutral-800">
      <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <Days currentDate={currentDate} />
      <Cells currentDate={currentDate} />
    </div>
  );
}

export default Calendar;
