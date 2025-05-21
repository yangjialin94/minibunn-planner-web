"use client";

import clsx from "clsx";
import React, { useEffect } from "react";

import Account from "@/components/user/Account";
import Support from "@/components/user/Support";
import { usePageStore } from "@/hooks/usePageStore";

interface UserHeaderProps {
  userTab: "account" | "support";
  setUserTab: (tab: "account" | "support") => void;
}

/**
 * User Header
 */
function UserHeader({ userTab, setUserTab }: UserHeaderProps) {
  const handleTabChange = (tab: "account" | "support") => {
    setUserTab(tab);
  };

  return (
    <div className="user-header">
      <button
        className={clsx("user-tab-btn", {
          selected: userTab === "account",
        })}
        onClick={() => handleTabChange("account")}
      >
        Account
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
    <>
      {/* Header */}
      <UserHeader userTab={userTab} setUserTab={setUserTab} />

      {/* Content */}
      {userTab === "account" ? (
        <Account />
      ) : userTab === "support" ? (
        <Support />
      ) : (
        <h1>Page is not found</h1>
      )}
    </>
  );
}

export default UserPage;
