"use client";

import clsx from "clsx";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import Journal from "@/components/journal/Journal";
import Tasks from "@/components/task/Tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime, parseLocalDate } from "@/utils/date";

/**
 * Daily Header
 */
interface DailyHeaderProps {
  dateStr: string;
  dailyTab: "tasks" | "journal";
  setDailyTab: (tab: "tasks" | "journal") => void;
}

function DailyHeader({ dateStr, dailyTab, setDailyTab }: DailyHeaderProps) {
  const router = useRouter();

  const date = parseLocalDate(dateStr);

  const handleTabChange = (tab: "tasks" | "journal") => {
    setDailyTab(tab);
  };

  const handleClickPrev = () => {
    router.push(`/calendar/${formatDateLocalNoTime(subDays(date, 1))}`);
  };

  const handleClickNext = () => {
    router.push(`/calendar/${formatDateLocalNoTime(addDays(date, 1))}`);
  };

  return (
    <div className="daily-header">
      <p className="text-lg font-bold">{dateStr}</p>
      <div className="flex items-center gap-2">
        <button
          className={clsx("daily-tab-btn", {
            selected: dailyTab === "tasks",
          })}
          onClick={() => handleTabChange("tasks")}
        >
          Tasks
        </button>
        <button
          className={clsx("daily-tab-btn", {
            selected: dailyTab === "journal",
          })}
          onClick={() => handleTabChange("journal")}
        >
          Journal
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="daily-arrow-btn" onClick={handleClickPrev}>
          <ChevronLeft />
        </button>
        <button className="daily-arrow-btn" onClick={handleClickNext}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

/**
 * Daily Page
 */
function DailyPage() {
  // Get the date from the URL
  const { date } = useParams();

  // Page state
  const setPage = usePageStore((state) => state.setPage);
  const dailyTab = usePageStore((state) => state.dailyTab);
  const setDailyTab = usePageStore((state) => state.setDailyTab);

  // Set the page
  const today = formatDateLocalNoTime(new Date());
  const dateStr = date ? (Array.isArray(date) ? date[0] : date) : today;

  useEffect(() => {
    if (dateStr === today) {
      setPage("today");
    } else {
      setPage("daily");
    }
  }, [dateStr, setPage, today]);

  // Error handling
  if (!date) {
    return <div>Error: Date parameter is missing.</div>;
  }

  return (
    <div className="scrollable-content">
      {/* Header */}
      <DailyHeader
        dateStr={dateStr}
        dailyTab={dailyTab}
        setDailyTab={setDailyTab}
      />

      {/* Content */}
      <div className="flex-1">
        {dailyTab === "tasks" ? (
          <Tasks dateStr={dateStr} />
        ) : (
          <Journal dateStr={dateStr} />
        )}
      </div>
    </div>
  );
}

export default DailyPage;
