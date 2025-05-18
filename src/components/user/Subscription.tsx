"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

import {
  cancelSubscription,
  fetchSubscriptionStatus,
} from "@/api/subscription";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { useAuth } from "@/hooks/useAuth";

/**
 * Subscription Component
 */
function Subscription() {
  const [error, setError] = React.useState("");
  const [canceling, setCanceling] = React.useState(false);

  // Check if the user is authenticated
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query client
  const queryClient = useQueryClient();

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
        position: "bottom-center",
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
  if (isLoading) {
    return <Loading />;
  }
  if (fetchError) {
    console.error(fetchError || "Error fetching subscription status");
    return <Error />;
  }

  return (
    <div className="overflow-y-auto p-4 md:p-6">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-neutral-800 p-4">
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

        {data?.plan_name !== "Lifetime Access" && (
          <div className="flex w-full justify-between border-b border-neutral-400">
            <p className="font-semibold">
              {data?.cancel_at_period_end
                ? "Cancellation Date"
                : "Next Billing Date"}
            </p>
            <p>{data?.period_end_date}</p>
          </div>
        )}

        {data?.plan_name !== "Lifetime Access" &&
          data?.cancel_at_period_end && (
            <Link
              className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
              href="/auth/resubscribe"
            >
              Renew Subscription
            </Link>
          )}

        {data?.plan_name !== "Lifetime Access" &&
          data?.cancel_at_period_end && (
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

export default Subscription;
