"use client";

import { Calendar, ChartBarBig } from "lucide-react";
import Link from "next/link";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";

function SideBar() {
  const currentPage = usePageStore((state) => state.currentPage);

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
          href="/streak"
          className={currentPage === "streak" ? "selected" : ""}
        >
          <ChartBarBig />
          Streak
        </Link>
      </nav>
    </aside>
  );
}

export default SideBar;
