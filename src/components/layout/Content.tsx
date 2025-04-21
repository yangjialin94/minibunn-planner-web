"use client";

import dynamic from "next/dynamic";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";

// dynamic imports SideBar to prevent SSR
const SideBar = dynamic(() => import("@/components/layout/SideBar"), {
  ssr: false,
  loading: () => null,
});

/**
 * Content component (used in layout.tsx)
 */
function Content({ children }: { children: React.ReactNode }) {
  const page = usePageStore((state) => state.page);

  return (
    <div className="sidebar-main">
      {page !== "auth" && <SideBar />}
      {children}
    </div>
  );
}

export default Content;
