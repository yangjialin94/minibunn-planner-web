"use client";

import clsx from "clsx";
import React, { useEffect } from "react";

import Subscription from "@/components/user/Subscription";
import Support from "@/components/user/Support";
import { usePageStore } from "@/hooks/usePageStore";

interface UserHeaderProps {
  userTab: "subscription" | "support";
  setUserTab: (tab: "subscription" | "support") => void;
}

/**
 * User Header
 */
function UserHeader({ userTab, setUserTab }: UserHeaderProps) {
  const handleTabChange = (tab: "subscription" | "support") => {
    setUserTab(tab);
  };

  return (
    <div className="user-header">
      <button
        className={clsx("user-tab-btn", {
          selected: userTab === "subscription",
        })}
        onClick={() => handleTabChange("subscription")}
      >
        Subscription
      </button>
      <button
        className={clsx("user-tab-btn", {
          selected: userTab === "support",
        })}
        onClick={() => handleTabChange("support")}
      >
        Support
      </button>
    </div>
  );
}

/**
 * User Page
 */
function UserPage() {
  // Page state
  const setPage = usePageStore((state) => state.setPage);
  const userTab = usePageStore((state) => state.userTab);
  const setUserTab = usePageStore((state) => state.setUserTab);

  // Set the page
  useEffect(() => {
    setPage("user");
  }, [setPage]);

  return (
    <div className="scrollable-content">
      {/* Header */}
      <UserHeader userTab={userTab} setUserTab={setUserTab} />

      {/* Content */}
      <div className="flex-1">
        {userTab === "subscription" ? <Subscription /> : <Support />}
      </div>
    </div>
  );
}

export default UserPage;
