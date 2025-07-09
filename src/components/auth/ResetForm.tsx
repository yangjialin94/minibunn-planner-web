"use client";

import clsx from "clsx";
import {
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Loading from "@/components/elements/Loading";
import { usePageStore } from "@/hooks/usePageStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrorParser";

function ResetForm() {
  const setPage = usePageStore((state) => state.setPage);

  const router = useRouter();
  const params = useSearchParams();
  const oobCode = params.get("oobCode") || "";

  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Set the page to auth
  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  // Verify the password reset code
  useEffect(() => {
    // Missing reset code - invalid reset link
    if (!oobCode) {
      return router.replace("/");
    }

    // Verify reset code
    verifyPasswordResetCode(getAuth(), oobCode)
      .then((emailFromCode) => setEmail(emailFromCode))
      .catch(() => {
        toast.error("Invalid or expired link.", {
          className: "bg-neutral-300 border-2 border-neutral-300 rounded-xl",
          progressClassName: "bg-red-500",
          autoClose: 2000,
          position: "bottom-center",
        });
        router.replace("/");
      })
      .finally(() => setLoading(false));
  }, [oobCode, router]);

  // Handle reset with new password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!newPassword || !confirmPassword) {
      return setError("Fill both fields.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords don't match.");
    }

    setLoading(true);
    setError("");

    // Submit the new password to Firebase
    try {
      await confirmPasswordReset(getAuth(), oobCode, newPassword);

      toast.success("Password reset!", {
        className: "bg-neutral-300 border-2 border-neutral-300 rounded-xl",
        progressClassName: "bg-green-500",
        autoClose: 2000,
        position: "bottom-center",
      });
      router.push("/");
    } catch (error) {
      console.error("Error with Firebase", error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle loading state
  if (loading) return <Loading />;

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
        <h1 className="mb-4">Reset password for {email}</h1>
        <p className="mb-8 text-neutral-500">
          Remember the password?{" "}
          <Link
            href="/"
            passHref
            className="font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Reset Form */}
        <form
          onSubmit={handleReset}
          className="flex w-full flex-col items-center space-y-4 rounded-xl border border-neutral-300 p-4"
        >
          <div className="w-full border-b border-neutral-300">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={clsx(
                "w-full rounded-xl border px-4 py-2 outline-none",
                {
                  "border-transparent": !error,
                  "border-red-500": error,
                },
              )}
              required
            />
          </div>
          <div className="w-full border-b border-neutral-300">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={clsx(
                "w-full rounded-xl border px-4 py-2 outline-none",
                {
                  "border-transparent": !error,
                  "border-red-500": error,
                },
              )}
              required
            />
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-white py-2 font-semibold hover:border-neutral-300 hover:bg-neutral-300"
          >
            Set New Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetForm;
