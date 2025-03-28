"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { formatDateLocal } from "@/lib/dateUtils";

function Header() {
  const [currentLocalTime, setCurrentLocalTime] = useState(() =>
    formatDateLocal(new Date()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocalTime(formatDateLocal(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <h1>Minimal Planner</h1>
      <div className="flex items-center gap-4">
        <p>{currentLocalTime}</p>
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
