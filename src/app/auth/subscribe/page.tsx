"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
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
        cancel_url: `${NEXT_PUBLIC_WEB_URL}`,
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
    <div className="auth-container">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center text-center">
        {/* Header */}
        <div className="mt-4 mb-6 text-center">
          <h1 className="mb-4 text-3xl font-bold">Plans & Pricing</h1>
          <ul className="mx-auto flex max-w-xs list-inside flex-col gap-1 text-center text-neutral-500">
            <li className="flex items-center gap-2">
              <Check />
              Unlimited Tasks & Journals
            </li>
            <li className="flex items-center gap-2">
              <Check />
              Progress Tracking
            </li>
            <li className="flex items-center gap-2">
              <Check />
              Notes Management
            </li>
          </ul>
        </div>

        {/* Pricing Options */}
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          {/* Monthly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="flex w-full flex-col items-center rounded-xl border p-6 text-center hover:cursor-pointer hover:bg-neutral-200 hover:ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mb-2 text-lg font-semibold">Monthly Plan</span>
            <span className="mb-3 text-3xl font-bold">$3.99</span>
            <span className="mb-1 text-sm text-neutral-500">
              Billed monthly after 7-day free trial
            </span>
            <span className="mt-2 text-xs text-neutral-400">
              *Free trial available for new users only
            </span>
          </motion.button>

          {/* Yearly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="flex w-full flex-col items-center rounded-xl border p-6 text-center hover:cursor-pointer hover:bg-neutral-200 hover:ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Save 37%
            </div>
            <span className="mb-2 text-lg font-semibold">Yearly Plan</span>
            <span className="mb-3 text-3xl font-bold">$29.99</span>
            <span className="mb-1 text-sm text-neutral-500">
              ($2.49 / month)
            </span>
            <span className="text-sm text-neutral-500">
              Billed yearly after 7-day free trial
            </span>
            <span className="mt-2 text-xs text-neutral-400">
              *Free trial available for new users only
            </span>
          </motion.button>

          {/* Home button */}
          <Link
            className="flex w-full cursor-pointer items-center justify-center rounded-full border border-transparent bg-neutral-100 px-4 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
            href="/"
          >
            Home
          </Link>

          {/* Error */}
          {error && <p className="py-2 pl-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default SubscribePage;
