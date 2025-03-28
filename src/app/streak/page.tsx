"use client";

import React, { useEffect } from "react";

import { usePageStore } from "@/hooks/usePageStore";

function StreakPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("streak");
  }, [setPage]);

  return (
    <>
      <h1>Streak</h1>
    </>
  );
}

export default StreakPage;
