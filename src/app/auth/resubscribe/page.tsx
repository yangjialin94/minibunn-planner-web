"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchPaymentUrl } from "@/api/subscription";
import { NEXT_PUBLIC_WEB_URL } from "@/env";
import {
  NEXT_PUBLIC_LIFETIME_PRICE_ID,
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
        mode:
          priceId === NEXT_PUBLIC_LIFETIME_PRICE_ID
            ? "payment"
            : "subscription",
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
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        {/* Header */}
        <div className="mt-4 mb-8 text-center">
          <h1 className="mb-8 text-3xl font-bold">Plans & Pricing</h1>

          <ul className="mx-auto flex max-w-sm list-inside flex-col gap-1 text-neutral-500 sm:text-sm">
            <li className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Unlimited Tasks & Journals
            </li>
            <li className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Progress Tracking
            </li>
            <li className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Notes Management
            </li>
          </ul>
        </div>

        {/* Pricing Options */}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Monthly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="flex flex-col items-center rounded-xl border p-6 text-center hover:bg-neutral-200 hover:ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mb-2 text-lg font-semibold">Monthly Plan</span>
            <span className="mb-3 text-3xl font-bold">$2.99</span>
          </motion.button>

          {/* Yearly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="flex flex-col items-center rounded-xl border p-6 text-center hover:bg-neutral-200 hover:ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Early Supporter
            </div>
            <span className="mb-2 text-lg font-semibold">Yearly Plan</span>
            <span className="mb-3 text-3xl font-bold">$19.99</span>
            <span className="text-sm text-neutral-500">($1.66 / month)</span>
          </motion.button>

          {/* Lifetime */}
          <motion.button
            onClick={() => handleSubscribe(NEXT_PUBLIC_LIFETIME_PRICE_ID)}
            disabled={loading}
            className="flex flex-col items-center rounded-xl border p-6 text-center hover:bg-neutral-200 hover:ring"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="mb-2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Best Value
            </div>
            <span className="mb-2 text-lg font-semibold">Lifetime Access</span>
            <span className="mb-3 text-3xl font-bold">$29.99</span>
            <span className="text-sm text-neutral-500">One-time payment</span>
            <span className="mt-2 text-xs text-neutral-400">
              🎁 Limited-time lifetime pricing
            </span>
          </motion.button>
        </div>

        {/* Home button */}
        <Link
          className="mt-8 flex w-full max-w-sm items-center justify-center rounded-full border border-transparent bg-neutral-100 px-4 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          href="/"
        >
          Back to Home
        </Link>

        {/* Error */}
        {error && <p className="py-2 pl-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default SubscribePage;
