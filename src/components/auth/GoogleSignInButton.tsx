"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { auth } from "@/auth/firebaseClient";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrorParser";

/**
 * Google Sign In Button
 */
function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // User data will be automatically fetched and set by AuthProvider
      // Navigate to calendar (home) page for all users
      router.push("/calendar");
    } catch (error) {
      console.error("Error with Google sign in", error);
      const errorMessage = getFirebaseErrorMessage(error);
      toast.error(errorMessage, {
        className: "bg-neutral-300 border-2 border-neutral-300 rounded-xl",
        progressClassName: "bg-red-500",
        autoClose: 4000,
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white py-2 font-semibold hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Image
        className="mr-3"
        src="/google-icon.svg"
        alt="Google Icon"
        width={20}
        height={20}
      />
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}

export default GoogleSignInButton;
