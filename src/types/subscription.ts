// Returned by the backend for GET /api/strip/subscription-status
export type Subscription = {
  is_subscribed: boolean;
  status: string;
  period_end_date: string;
  cancel_at_period_end: boolean;
  plan_name: string;
  price_amount: number;
  price_currency: string;
};

// Returned by the backend for POST /api/stripe/create-checkout-session
export type CheckoutSession = {
  url: string;
};

// Payload for creating a new checkout session (POST /api/stripe/create-checkout-session)
export type CheckoutSessionCreate = {
  price_id: string;
  success_url: string;
  cancel_url: string;
};
