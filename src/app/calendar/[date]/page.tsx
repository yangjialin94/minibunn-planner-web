"use client";

import { useParams } from "next/navigation";
import React from "react";

function DailyTasks() {
  const { date } = useParams();
  return <div>Current date is: {date}</div>;
}

export default DailyTasks;
