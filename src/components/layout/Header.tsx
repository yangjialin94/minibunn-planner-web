"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocal } from "@/utils/date";

const TimeDisplay = () => {
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
};

function Header() {
  // State management for sidebar visibility
  const isSidebarOpen = usePageStore((state) => state.isSidebarOpen);
  const switchSidebarOpen = usePageStore((state) => state.switchSidebarOpen);

  return (
    <header>
      <div className="flex gap-4">
        <button
          onClick={() => switchSidebarOpen()}
          className="rounded-full px-2.5 py-2 hover:cursor-pointer hover:bg-neutral-300"
        >
          {isSidebarOpen ? (
            <PanelRightOpen size={20} />
          ) : (
            <PanelRightClose size={20} />
          )}
        </button>

        {/* Logo */}
        <Link
          href="https://www.minibunnplanner.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4"
        >
          <Image
            src="/minibunn-planner-logo.svg"
            alt="logo"
            width={100}
            height={100}
          />
        </Link>
      </div>

      {/* Time Display */}
      <div className="hidden sm:flex">
        <TimeDisplay />
      </div>
    </header>
  );
}

export default Header;
