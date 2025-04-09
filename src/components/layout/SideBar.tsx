"use client";

import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { Calendar, ListCheck, LogOut, Notebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { auth } from "@/auth/firebaseClient";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime } from "@/utils/date";

function SideBar() {
  const router = useRouter();
  const page = usePageStore((state) => state.page);

  const today = formatDateLocalNoTime(new Date());

  if (page === "auth") {
    return null;
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);

      // Remove the token from cookies
      Cookies.remove("token");
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <aside>
      <nav>
        <Link
          href="/calendar"
          className={page === "calendar" ? "selected" : ""}
        >
          <Calendar />
          <span>Calendar</span>
        </Link>
      </nav>
      <nav>
        <Link
          href={`/calendar/${today}`}
          className={page === "today" ? "selected" : ""}
        >
          <ListCheck />
          <span>Today</span>
        </Link>
      </nav>
      <nav>
        <Link href="/notes" className={page === "notes" ? "selected" : ""}>
          <Notebook />
          <span>Notes</span>
        </Link>
      </nav>
      <nav>
        <button onClick={handleSignOut} className="sidebar-item">
          <LogOut />
          <span>Sign out</span>
        </button>
      </nav>
    </aside>
  );
}

export default SideBar;
