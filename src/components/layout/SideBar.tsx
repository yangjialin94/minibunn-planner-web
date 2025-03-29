"use client";

import { Calendar, ListCheck, NotebookPen } from "lucide-react";
import Link from "next/link";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";

function SideBar() {
  const currentPage = usePageStore((state) => state.currentPage);
  const taskDateStr = usePageStore((state) => state.taskDateStr);

  return (
    <aside>
      <nav>
        <Link href="/" className={currentPage === "calendar" ? "selected" : ""}>
          <Calendar />
          <span>Calendar</span>
        </Link>
      </nav>
      <nav>
        <Link
          href={`/calendar/${taskDateStr}`}
          className={currentPage === "daily" ? "selected" : ""}
        >
          <ListCheck />
          <span>Task</span>
        </Link>
      </nav>
      <nav>
        <Link
          href="/journal"
          className={currentPage === "journal" ? "selected" : ""}
        >
          <NotebookPen />
          Journal
        </Link>
      </nav>
    </aside>
  );
}

export default SideBar;
