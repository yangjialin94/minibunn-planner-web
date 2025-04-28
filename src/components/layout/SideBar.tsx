"use client";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { Calendar, ListCheck, LogOut, Notebook, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { auth } from "@/auth/firebaseClient";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime } from "@/utils/date";

interface SidebarLinkProps {
  selected: boolean;
  href: string;
  icon: React.ReactNode;
  text: string;
}

interface SidebarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}

/**
 * SidebarLink component
 */
const SidebarLink = ({ selected, href, icon, text }: SidebarLinkProps) => {
  return (
    <div className="relative">
      <nav>
        <Link href={href} className={clsx("peer", selected && "selected")}>
          {icon}
          <span className="hidden md:block">{text}</span>
        </Link>
        <div className="tool-tip right block md:hidden">{text}</div>
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
          <span className="hidden md:block">{text}</span>
        </button>
        <div className="tool-tip right block md:hidden">{text}</div>
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
          icon={<Calendar />}
          text="Home"
        />
        <SidebarLink
          selected={page === "today"}
          href={`/calendar/${today}`}
          icon={<ListCheck />}
          text="Today"
        />
        <SidebarLink
          selected={page === "notes"}
          href="/notes"
          icon={<Notebook />}
          text="Notes"
        />
        <SidebarLink
          selected={page === "user"}
          href="/user"
          icon={<User />}
          text="User"
        />
      </div>

      <div className="sidebar-bottom">
        <SidebarButton
          onClick={handleSignOut}
          icon={<LogOut />}
          text="Sign out"
        />
      </div>
    </aside>
  );
}

export default SideBar;
