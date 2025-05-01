"use client";

import { type ActionCodeSettings, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";

import { auth } from "@/auth/firebaseClient";
import { NEXT_PUBLIC_WEB_URL } from "@/env";
import { useUserStore } from "@/hooks/useUserStore";

/**
 * ChangePassword Component
 */
function ChangePassword() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = useUserStore((state) => state.email);

  console.log("ChangePassword component rendered with email:", email);

  // Handle reset with email and password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    const actionCodeSettings: ActionCodeSettings = {
      url: `${NEXT_PUBLIC_WEB_URL}/auth/reset`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      toast.success("Reset link sent! Check your email.", {
        className: "bg-neutral-300 border-2 border-neutral-800 rounded-xl",
        progressClassName: "bg-green-500",
        autoClose: 2000,
        position: "bottom-center",
      });
    } catch (error) {
      console.error("Error sending reset email", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
        >
          {loading ? "Sending link..." : "Change password"}
        </button>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
