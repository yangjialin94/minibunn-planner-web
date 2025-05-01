"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { fetchUser } from "@/api/user";
import { auth } from "@/auth/firebaseClient";
import { useUserStore } from "@/hooks/useUserStore";

/**
 * Google Sign In Button
 */
function GoogleSignInButton() {
  const router = useRouter();

  const setName = useUserStore((state) => state.setName);
  const setEmail = useUserStore((state) => state.setEmail);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      const user = await fetchUser();

      // Set user details in the store
      setName(user.name);
      setEmail(user.email);

      if (user.is_subscribed) {
        router.push("/calendar");
      } else {
        router.push("/auth/subscribe");
      }
    } catch (error) {
      console.error("Error with Google sign in", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex w-full items-center justify-center rounded-full border bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
    >
      <Image
        className="mr-3"
        src="/google-icon.svg"
        alt="Google Icon"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
}

export default GoogleSignInButton;
