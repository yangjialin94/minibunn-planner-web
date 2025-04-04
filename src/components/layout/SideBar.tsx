"use client";

import { Calendar, ListCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime } from "@/lib/dateUtils";

function SideBar() {
  const page = usePageStore((state) => state.page);
  const today = formatDateLocalNoTime(new Date());

  if (page === "auth") {
    return null;
  }

  return (
    <aside>
      <nav>
        <Link
          href="/calendar"
          className={page === "calendar" ? "selected" : ""}
        >
          <Calendar />
          <span>Calendar</span>
        </Link>
      </nav>
      <nav>
        <Link
          href={`/calendar/${today}`}
          className={page === "today" ? "selected" : ""}
        >
          <ListCheck />
          <span>Today</span>
        </Link>
      </nav>
    </aside>
  );
}

export default SideBar;
