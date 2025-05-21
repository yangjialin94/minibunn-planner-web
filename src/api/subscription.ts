import { NEXT_PUBLIC_API_URL } from "@/env";
import {
  CheckoutSession,
  CheckoutSessionCreate,
  Subscription,
} from "@/types/subscription";
import { apiFetch } from "@/utils/apiFetch";

/**
 * Fetch payment URL.
 */
export async function fetchPaymentUrl(
  data: CheckoutSessionCreate,
): Promise<CheckoutSession> {
  const res = await apiFetch(
    `${NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error("Failed to fetch checkout url");
  return res.json();
}

/**
 * Fetch subscription status.
 */
export async function fetchSubscriptionStatus(): Promise<Subscription> {
  const res = await apiFetch(
    `${NEXT_PUBLIC_API_URL}/api/stripe/subscription-status`,
  );
  if (!res.ok) throw new Error("Failed to fetch subscription status");
  return res.json();
}

/**
 * Cancel subscription.
 */
// export async function cancelSubscription(): Promise<string> {
//   const res = await apiFetch(
//     `${NEXT_PUBLIC_API_URL}/api/stripe/cancel-subscription/`,
//     {
//       method: "POST",
//     },
//   );
//   if (!res.ok) throw new Error("Failed to cancel subscription");
//   const data = await res.json();
//   return data.message;
// }
