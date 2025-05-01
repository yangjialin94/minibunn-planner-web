"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import SignInForm from "@/components/auth/SignInForm";
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Login Page
 */
function LoginPage() {
  const setPage = usePageStore((state) => state.setPage);

  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  return (
    <div className="auth-container">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center text-center">
        {/* Logo */}
        <div className="relative mb-4 h-12 w-12">
          <Image
            src="/minibunn-logo.svg"
            alt="Minibunn icon"
            fill
            sizes="40px"
            className="object-contain"
            priority
          />
        </div>

        {/* Title & Description */}
        <h1 className="mb-4 text-2xl font-bold">Welcome</h1>
        <p className="mb-2 text-neutral-500">
          Enter your email and password to log into your account.
        </p>
        <p className="mb-8 text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            passHref
            className="font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Sign In Form */}
        <SignInForm />

        {/* Divider */}
        <hr className="my-8 w-full border-t-2 border-neutral-200" />

        {/* Google Sign In */}
        <GoogleSignInButton />

        {/* Forgot Password */}
        <Link
          href="/auth/forgot-password"
          passHref
          className="mt-4 font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
