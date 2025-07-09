"use client";

import React from "react";

import Plans from "@/components/subscription/Plans";
import { useUserStore } from "@/hooks/useUserStore";

import Personal from "./Personal";
import Subscription from "./Subscription";

/**
 * Account Component
 */
function Account() {
  // Zustand state for user subscription
  const isSubscribed = useUserStore((state) => state.isSubscribed);

  // Handle unsubscribed users
  if (!isSubscribed) {
    return <Plans />;
  }

  // Render the account page
  return (
    <div className="space-y-4 overflow-y-auto p-4">
      {/* Personal Section */}
      <Personal />

      {/* Subscription Section */}
      <Subscription />
    </div>
  );
}

export default Account;
