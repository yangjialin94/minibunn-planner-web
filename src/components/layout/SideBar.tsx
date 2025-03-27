import { Calendar, ChartBarBig } from "lucide-react";
import Link from "next/link";
import React from "react";

function SideBar() {
  return (
    <aside>
      <nav>
        <Link href="/">
          <Calendar />
          <span>Calendar</span>
        </Link>
      </nav>
      <nav>
        <Link href="/streak">
          <ChartBarBig />
          Streak
        </Link>
      </nav>
    </aside>
  );
}

export default SideBar;
