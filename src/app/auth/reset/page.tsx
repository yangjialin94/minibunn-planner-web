"use client";

import clsx from "clsx";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { auth } from "@/auth/firebaseClient"; // Handle sign in with email and password
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Reset Page
 */
function ResetPage() {
  const setPage = usePageStore((state) => state.setPage);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    firebaseError: "",
  });
  const [loading, setLoading] = useState(false);

  // Set the page to auth
  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ ...errors, [e.target.name]: "", firebaseError: "" });
  };

  // Handle reset with email and password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", firebaseError: "" });

    // Basic email validation
    if (!email) {
      setErrors({
        ...errors,
        email: !email ? "Email is required." : "",
      });
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmail("");
      toast.success("Reset email sent!", {
        className: "bg-neutral-300 border-2 border-neutral-800 rounded-xl",
        progressClassName: "bg-green-500",
        autoClose: 2000,
        position: "bottom-left",
      });
    } catch (error) {
      console.error("Error sending reset email", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center text-center">
        {/* Title & Description */}
        <h1 className="mb-4 text-2xl font-bold">Forgotten password</h1>
        <p className="mb-2 text-neutral-500">
          Enter your email to reset your password.
        </p>
        <p className="mb-2 text-neutral-500">
          Have an account?{" "}
          <Link
            href="/"
            passHref
            className="font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="mb-8 text-neutral-500">
          New user?{" "}
          <Link
            href="/auth/register"
            passHref
            className="font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Reset Form */}
        <form
          onSubmit={handleReset}
          className="flex w-full flex-col items-center space-y-4 rounded-xl border border-neutral-800 p-4"
        >
          <div className="flex w-full flex-col gap-2 border-b border-neutral-400">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className={clsx(
                "w-full rounded-xl border px-4 py-2 outline-none",
                {
                  "border-transparent": !errors.email,
                  "border-red-500": errors.email,
                },
              )}
              required
            />
            {errors.email && (
              <p className="py-2 pl-4 text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          >
            {loading ? "Sending reset..." : "Reset"}
          </button>

          {errors.firebaseError && (
            <p className="text-center text-sm text-red-500">
              {errors.firebaseError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPage;
