"use client";

import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { Calendar, ListCheck, LogOut, Notebook, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { auth } from "@/auth/firebaseClient";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime } from "@/utils/date";

/**
 * Sidebar component
 */
function SideBar() {
  const router = useRouter();
  const page = usePageStore((state) => state.page);

  const queryClient = useQueryClient();

  const today = formatDateLocalNoTime(new Date());

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries();

      // Remove the token from cookies
      Cookies.remove("token");
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <aside>
      <div className="sidebar-top">
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
          <Link href="/user" className={page === "user" ? "selected" : ""}>
            <User />
            <span>User</span>
          </Link>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <nav>
          <button onClick={handleSignOut} className="sidebar-item">
            <LogOut />
            <span>Sign out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default SideBar;
