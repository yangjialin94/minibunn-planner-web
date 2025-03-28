"use client";

import { useEffect } from "react";

import Calendar from "@/components/Calendar";
import { usePageStore } from "@/hooks/usePageStore";

export default function CalendarPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("calendar");
  }, [setPage]);

  return <Calendar />;
}
