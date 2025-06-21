"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

import { fetchSubscriptionStatus } from "@/api/subscription";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { useAuth } from "@/hooks/useAuth";
import { NEXT_PUBLIC_CUSTOMER_PORTAL_LINK } from "@/lib/env";

/**
 * Subscription Component
 */
function Subscription() {
  // Check if the user is authenticated
  const { user } = useAuth();
  const tokenReady = !!user;

  // Fetch subscription status
  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => fetchSubscriptionStatus(),
    enabled: tokenReady,
  });

  // Handle loading and error states
  if (isLoading) {
    return <Loading size={40} />;
  }
  if (fetchError) {
    console.error(fetchError || "Error fetching subscription status");
    return <Error />;
  }

  return (
    <div>
      <h1 className="mb-4">Subscription</h1>
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-neutral-300 p-4">
        <div className="flex w-full justify-between border-b border-neutral-300">
          <p className="font-semibold">Plan</p>
          <p>{data?.plan_name}</p>
        </div>

        <div className="flex w-full justify-between border-b border-neutral-300">
          <p className="font-semibold">Price</p>
          <p>
            {data?.price_amount} {data?.price_currency}
          </p>
        </div>

        {data?.plan_name !== "Lifetime Access" && (
          <div className="flex w-full justify-between border-b border-neutral-300">
            <p className="font-semibold">
              {data?.cancel_at_period_end
                ? "Cancellation Date"
                : "Next Billing Date"}
            </p>
            <p>{data?.period_end_date}</p>
          </div>
        )}

        {data?.plan_name !== "Lifetime Access" && (
          <Link
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-white py-2 font-semibold hover:border-neutral-300 hover:bg-neutral-300"
            href={NEXT_PUBLIC_CUSTOMER_PORTAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Manage subscription
          </Link>
        )}
      </div>
    </div>
  );
}

export default Subscription;
