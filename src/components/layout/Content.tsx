"use client";

import React from "react";

import SideBar from "@/components/layout/SideBar";
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Content component (used in layout.tsx)
 */
function Content({ children }: { children: React.ReactNode }) {
  const page = usePageStore((state) => state.page);
  const isSidebarOpen = usePageStore((state) => state.isSidebarOpen);
  const switchSidebarOpen = usePageStore((state) => state.switchSidebarOpen);

  // Function to handle backdrop click
  const handleBackdropClick = () => {
    switchSidebarOpen();
  };

  return (
    <div className="sidebar-main">
      {page !== "auth" && isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 top-0 left-62.5 z-20 bg-neutral-300 opacity-80 md:hidden"
            onClick={handleBackdropClick}
          ></div>
          <SideBar />
        </>
      )}
      {children}
    </div>
  );
}

export default Content;
