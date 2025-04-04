"use client";

import Image from "next/image";
import React, { memo, useEffect, useState } from "react";

import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocal } from "@/lib/dateUtils";

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

const UserProfile = memo(() => {
  return (
    <button
      className="rounded-full border border-transparent hover:cursor-pointer hover:border-neutral-800"
      onClick={() => window.alert("Settings clicked")}
    >
      <Image
        className="block h-8 shrink-0 rounded-full"
        src="/settings_icon.png"
        alt=""
        height="32"
        width="32"
      />
    </button>
  );
});
UserProfile.displayName = "UserProfile";

function Header() {
  const page = usePageStore((state) => state.page);

  return (
    <header>
      <h1>Minimal Planner</h1>
      <div className="flex items-center gap-4">
        <TimeDisplay />
        {page === "auth" ? null : <UserProfile />}
      </div>
    </header>
  );
}

export default Header;
