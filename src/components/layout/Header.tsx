"use client";

import Image from "next/image";
import React from "react";

function Header() {
  const date = new Date();
  const formatted = date.toLocaleString("en-US", {
    weekday: "short", // e.g. "Thu"
    month: "short", // e.g. "Mar"
    day: "numeric", // e.g. "27"
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format (AM/PM)
  });

  return (
    <header>
      <h1>Minimal Planner</h1>
      <div className="flex items-center gap-4">
        <p>{formatted}</p>
        <button
          className="rounded-full border border-transparent hover:cursor-pointer hover:border-neutral-800"
          onClick={() => window.alert("Profile clicked")}
        >
          <Image
            className="block h-8 shrink-0 rounded-full"
            src="/profile_image.jpg"
            alt=""
            height="32"
            width="32"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;
