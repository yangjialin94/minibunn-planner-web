"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

import {
  cancelSubscription,
  fetchSubscriptionStatus,
} from "@/api/subscription";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Subscription Page
 */
function SubscriptionPage() {
  const [error, setError] = React.useState("");
  const [canceling, setCanceling] = React.useState(false);

  // Page state
  const setPage = usePageStore((state) => state.setPage);

  // Check if the user is authenticated
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query client
  const queryClient = useQueryClient();

  // Set the page
  useEffect(() => {
    setPage("subscription");
  }, [setPage]);

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

  // Handle user cancel subscription
  const handleUnsubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    setCanceling(true);

    try {
      const message = await cancelSubscription();
      toast.success(message, {
        className: "bg-neutral-300 border-2 border-neutral-800 rounded-xl",
        progressClassName: "bg-green-500",
        autoClose: 4000,
        position: "bottom-left",
      });

      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    } catch (error) {
      console.error("Error signing out", error);
      setError((error as Error).message);
    } finally {
      setCanceling(false);
    }
  };

  // Handle loading and error states
  if (isLoading)
    return <div className="p-4">Loading subscription status...</div>;
  if (fetchError) {
    console.error(fetchError);
    return <div className="p-4">Error loading subscription status.</div>;
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-scroll">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl border p-4">
        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Plan</p>
          <p>{data?.plan_name}</p>
        </div>

        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Price</p>
          <p>
            {data?.price_amount} {data?.price_currency}
          </p>
        </div>

        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Period End Date</p>
          <p>{data?.period_end_date}</p>
        </div>

        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Cancel at Period End</p>
          <p>{data?.cancel_at_period_end ? "Yes" : "No"}</p>
        </div>

        {data?.cancel_at_period_end ? (
          <Link
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
            href="/auth/resubscribe"
          >
            Renew Subscription
          </Link>
        ) : (
          <button
            disabled={canceling}
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
            onClick={handleUnsubscribe}
          >
            {canceling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        )}

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default SubscriptionPage;
