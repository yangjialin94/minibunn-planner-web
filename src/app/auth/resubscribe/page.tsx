"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchPaymentUrl } from "@/api/subscription";
import { NEXT_PUBLIC_WEB_URL } from "@/env";
import {
  NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID,
  NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID,
} from "@/env";
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Subscribe Page
 */
function SubscribePage() {
  const setPage = usePageStore((state) => state.setPage);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Set the page to auth
  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  // Handle subscribe with plan id
  const handleSubscribe = async (priceId: string | undefined) => {
    if (!priceId) {
      console.error("Invalid price ID");
      setError("Invalid price ID");
      return;
    }

    setLoading(true);

    try {
      const data = {
        price_id: priceId,
        success_url: `${NEXT_PUBLIC_WEB_URL}/calendar`,
        cancel_url: `${NEXT_PUBLIC_WEB_URL}/subscription`,
      };
      const checkoutSession = await fetchPaymentUrl(data);
      window.location.assign(checkoutSession.url);
    } catch (error) {
      console.error("Error with generating payment url", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-scroll">
      <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4">
        <button
          className="flex w-full cursor-pointer items-center justify-between rounded-full border bg-neutral-100 px-4 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          onClick={() =>
            handleSubscribe(NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID)
          }
          disabled={loading}
        >
          <span className="text-lg font-semibold">Month Plan</span> $3.49
        </button>

        <p className="font-semibold text-neutral-500">•</p>

        <button
          className="flex w-full cursor-pointer items-center justify-between rounded-full border bg-neutral-100 px-4 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          onClick={() =>
            handleSubscribe(NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID)
          }
          disabled={loading}
        >
          <span className="text-lg font-semibold">Yearly Plan</span>
          <span>
            <span className="font-light text-neutral-500 line-through">
              $41.88
            </span>{" "}
            $34.99
          </span>
        </button>

        <p className="font-semibold text-neutral-500">•</p>

        <Link
          className="flex w-full cursor-pointer items-center justify-center rounded-full border bg-neutral-100 px-4 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          href="/calendar"
        >
          Calendar
        </Link>

        {error && <p className="py-2 pl-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default SubscribePage;
