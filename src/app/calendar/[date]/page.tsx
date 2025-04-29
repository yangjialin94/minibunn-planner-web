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

interface DailyHeaderProps {
  dateStr: string;
  dailyTab: "tasks" | "journal";
  setDailyTab: (tab: "tasks" | "journal") => void;
}

/**
 * Daily Header
 */
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
    <>
      {/* Header for larger screens */}
      <div className="sticky top-0 z-20 hidden sm:block">
        <div className="daily-header">
          <h2>{dateStr}</h2>
          <div className="flex items-center gap-1 lg:gap-2">
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
          <div className="flex items-center gap-1 lg:gap-2">
            <button className="daily-arrow-btn" onClick={handleClickPrev}>
              <ChevronLeft />
            </button>
            <button className="daily-arrow-btn" onClick={handleClickNext}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Header for smaller screens */}
      <div className="sticky top-0 z-20 block sm:hidden">
        <div className="flex flex-col">
          <div className="daily-header">
            <h2>{dateStr}</h2>
            <div className="flex items-center gap-1 lg:gap-2">
              <button className="daily-arrow-btn" onClick={handleClickPrev}>
                <ChevronLeft />
              </button>
              <button className="daily-arrow-btn" onClick={handleClickNext}>
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="daily-header-single">
            <div className="flex items-center gap-1 lg:gap-2">
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
          </div>
        </div>
      </div>
    </>
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
