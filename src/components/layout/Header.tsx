"use client";

import Image from "next/image";
import React, { memo, useEffect, useState } from "react";

import { formatDateLocal } from "@/utils/date";

const TimeDisplay = memo(() => {
  const [currentLocalTime, setCurrentLocalTime] = useState(() =>
    formatDateLocal(new Date()),
  );

  // Automatically update the current local time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocalTime(formatDateLocal(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p>{currentLocalTime}</p>;
});
TimeDisplay.displayName = "TimeDisplay";

function Header() {
  return (
    <header>
      <Image
        src="/minibunn-planner-logo.svg"
        alt="logo"
        width={100}
        height={100}
      />
      <TimeDisplay />
    </header>
  );
}

export default Header;
