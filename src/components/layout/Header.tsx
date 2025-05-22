"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import HeaderMenu from "@/components/modals/HeaderMenu";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocal } from "@/utils/date";

const MotionLink = motion.create(Link);

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
  const page = usePageStore((state) => state.page);

  return (
    <header>
      {/* Logo */}
      <MotionLink
        href="https://www.minibunnplanner.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Image
          src="/minibunn-planner-logo.svg"
          alt="logo"
          width={100}
          height={100}
        />
      </MotionLink>

      {/* Time Display */}
      <div className="hidden sm:flex">
        <TimeDisplay />
      </div>

      {/* Header Menu */}
      <div className="flex sm:hidden">{page !== "auth" && <HeaderMenu />}</div>
    </header>
  );
}

export default Header;
