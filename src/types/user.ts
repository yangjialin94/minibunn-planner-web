// Returned by the backend for GET /user
export type User = {
  id: number;
  firebase_uid: string;
  name: string;
  email: string;

  stripe_customer_id: string;
  stripe_subscription_id: string;
  subscription_status: string;
  is_subscribed: boolean;
};
