"use client";

import React from "react";

import Personal from "./Personal";
import Subscription from "./Subscription";

/**
 * Account Component
 */
function Account() {
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
