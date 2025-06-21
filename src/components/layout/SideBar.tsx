"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { Calendar, ListCheck, LogOut, Notebook, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { fetchTasksCompletionInRange } from "@/api/tasks";
import { auth } from "@/auth/firebaseClient";
import { useIsMd } from "@/hooks/useMediaQuery";
import { usePageStore } from "@/hooks/usePageStore";
import { TaskCompletion } from "@/types/task";
import { formatDateLocalNoTime } from "@/utils/date";

interface SidebarLinkProps {
  selected: boolean;
  href: string;
  icon: React.ReactNode;
  text: string;
  status?: string;
}

interface SidebarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}

/**
 * SidebarLink component
 */
const SidebarLink = ({
  selected,
  href,
  icon,
  text,
  status,
}: SidebarLinkProps) => {
  // Check if the screen size is medium or larger
  const isMed = useIsMd();

  // Function to handle navigation if not on medium or larger screens
  const onHandleNav = () => {
    if (!isMed) {
      usePageStore.getState().switchSidebarOpen(false);
    }
  };

  return (
    <div className="relative">
      <nav>
        <Link
          href={href}
          className={clsx("peer flex items-center", selected && "selected")}
          onClick={onHandleNav}
        >
          <span className="flex gap-2">
            {icon}
            <span>{text}</span>
          </span>
          <span>{status}</span>
        </Link>
      </nav>
    </div>
  );
};

/**
 * SidebarButton component
 */
const SidebarButton = ({ onClick, icon, text }: SidebarButtonProps) => {
  return (
    <div className="relative">
      <nav>
        <button
          onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClick();
          }}
          className="sidebar-item peer"
        >
          {icon}
          <span>{text}</span>
        </button>
      </nav>
    </div>
  );
};

/**
 * Sidebar component
 */
function SideBar() {
  const router = useRouter();
  const page = usePageStore((state) => state.page);

  const queryClient = useQueryClient();

  const today = formatDateLocalNoTime(new Date());

  // Fetching tasks completion for today
  console.log(`Fetching tasks completion for today: ${today}`);

  const { data, error, isLoading } = useQuery<TaskCompletion[]>({
    queryKey: ["tasksCompletion", today],
    queryFn: () => fetchTasksCompletionInRange(today, today),
  });

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
        <SidebarLink
          selected={page === "calendar"}
          href="/calendar"
          icon={<Calendar size={20} />}
          text="Home"
        />
        <SidebarLink
          selected={page === "today"}
          href={`/calendar/${today}`}
          icon={<ListCheck size={20} />}
          text="Today"
          status={
            isLoading || error || !data || !data.length
              ? ""
              : `${data[0].completed}/${data[0].total}`
          }
        />
        <SidebarLink
          selected={page === "notes"}
          href="/notes"
          icon={<Notebook size={20} />}
          text="Notes"
        />
        <SidebarLink
          selected={page === "user"}
          href="/user"
          icon={<User size={20} />}
          text="User"
        />
      </div>
      <div className="sidebar-bottom">
        <SidebarButton
          onClick={handleSignOut}
          icon={<LogOut size={20} />}
          text="Sign out"
        />
      </div>
    </aside>
  );
}

export default SideBar;
