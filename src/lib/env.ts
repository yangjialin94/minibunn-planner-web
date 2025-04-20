import { z } from "zod";

// Schema describing the env vars that are exposed to the client bundle.
const clientEnvSchema = z.object({
  NEXT_PUBLIC_WEB_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["dev", "qa", "prod"]),
  NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID: z.string().min(1),
  NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID: z.string().min(1),
});

// Validate the env vars at build time
export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID:
    process.env.NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID,
  NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID:
    process.env.NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID,
});

// Convenient named exports ↓ no need to dot‑access each time
export const {
  NEXT_PUBLIC_WEB_URL,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_MONTHLY_SUBSCRIPTION_PRICE_ID,
  NEXT_PUBLIC_YEARLY_SUBSCRIPTION_PRICE_ID,
} = env;

export type Env = z.infer<typeof clientEnvSchema>;
