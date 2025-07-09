"use client";

import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { fetchPaymentUrl } from "@/api/subscription";
import { NEXT_PUBLIC_WEB_URL } from "@/env";
import {
  NEXT_PUBLIC_LIFETIME_PRICE_ID,
  NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID,
  NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID,
} from "@/env";

/**
 * Plans component
 * Displays subscription plans and handles user subscription actions.
 */
function Plans() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        </div>

        {/* Pricing Options */}
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Free */}
          <div className="relative flex flex-col items-center rounded-2xl border-2 border-neutral-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
            <div className="mb-4 rounded-lg bg-gray-100 px-4 py-2">
              <span className="text-lg font-bold text-gray-700">Free</span>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <ul className="mb-6 flex w-full flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Task Tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                  <X className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-gray-400">Journal Keeping</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                  <X className="h-3 w-3 text-red-600" />
                </div>
                <span className="text-gray-400">Notes Management</span>
              </li>
            </ul>
            <div className="mt-auto">
              <span className="text-xs text-gray-400">
                * Available until we run out of free tier capacity
              </span>
            </div>
          </div>

          {/* Monthly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="group relative flex flex-col items-center rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-100 to-white p-8 text-center shadow-lg transition-all duration-300 hover:cursor-pointer hover:border-blue-300 hover:shadow-xl"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
              <span className="rounded-full border-2 border-yellow-400 bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700 shadow-sm">
                Popular
              </span>
            </div>
            <div className="mb-4 rounded-lg bg-blue-100 px-4 py-2 group-hover:bg-blue-200">
              <span className="text-lg font-bold text-blue-700">
                Monthly Plan
              </span>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-900">$2.99</span>
              <span className="text-sm text-blue-600">/month</span>
            </div>
            <ul className="mb-6 flex w-full flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Task Tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Journal Keeping</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Notes Management</span>
              </li>
            </ul>
            <div className="mt-auto">
              <span className="text-xs text-blue-500">* Billed monthly</span>
            </div>
          </motion.button>

          {/* Yearly */}
          <motion.button
            onClick={() =>
              handleSubscribe(NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID)
            }
            disabled={loading}
            className="group relative flex flex-col items-center rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-purple-50 to-white p-8 text-center shadow-lg transition-all duration-300 hover:cursor-pointer hover:border-purple-300 hover:shadow-xl"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
              <span className="rounded-full border-2 border-green-400 bg-green-100 px-4 py-1 text-sm font-bold text-green-700 shadow-sm">
                Best Value
              </span>
            </div>
            <div className="mb-4 rounded-lg bg-purple-100 px-4 py-2 group-hover:bg-purple-200">
              <span className="text-lg font-bold text-purple-700">
                Yearly Plan
              </span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-purple-900">$19.99</span>
              <span className="text-sm text-purple-600">/year</span>
            </div>
            <div className="mb-6">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Save 44% • $1.67/month
              </span>
            </div>
            <ul className="mb-6 flex w-full flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Task Tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Journal Keeping</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">Notes Management</span>
              </li>
            </ul>
            <div className="mt-auto">
              <span className="text-xs text-purple-500">* Billed yearly</span>
            </div>
          </motion.button>
        </div>

        {/* Error */}
        {error && <p className="py-2 pl-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default Plans;
