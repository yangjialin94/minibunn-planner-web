"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { usePageStore } from "@/hooks/usePageStore";

function DailyPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("daily");
  }, [setPage]);

  const { date } = useParams();
  return <div>Current date is: {date}</div>;
}

export default DailyPage;
