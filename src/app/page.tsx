"use client";

import Link from "next/link";
import { useEffect } from "react";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import SignInForm from "@/components/auth/SignInForm";
import { usePageStore } from "@/hooks/usePageStore";

const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

/**
 * Login Page
 */
function LoginPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  return (
    <div className="flex flex-1 items-center justify-center overflow-scroll">
      <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4">
        {env !== "qa" && (
          <>
            <GoogleSignInButton />
            <p className="font-semibold text-neutral-500">•</p>
          </>
        )}
        <SignInForm />
        {env !== "qa" && (
          <>
            <p className="font-semibold text-neutral-500">•</p>
            <Link
              className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
              href="/auth/register"
              passHref
            >
              Register
            </Link>
          </>
        )}
        <p className="font-semibold text-neutral-500">•</p>
        <Link
          className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          href="/auth/reset"
          passHref
        >
          Reset Password
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
