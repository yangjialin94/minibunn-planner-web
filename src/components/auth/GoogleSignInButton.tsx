"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { fetchUser } from "@/api/user";
import { auth } from "@/auth/firebaseClient";

/**
 * Google Sign In Button
 */
function GoogleSignInButton() {
  const router = useRouter();

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      const user = await fetchUser();

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
      className="flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white py-2 font-semibold hover:bg-neutral-300"
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
