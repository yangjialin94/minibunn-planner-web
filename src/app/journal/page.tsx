"use client";

import React, { useEffect } from "react";

import { usePageStore } from "@/hooks/usePageStore";

function StreakPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("journal");
  }, [setPage]);

  return (
    <div className="p-4">
      <h1>Journal</h1>
    </div>
  );
}

export default StreakPage;
