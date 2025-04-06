"use client";

import { onIdTokenChanged, signOut, User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";
import React, { createContext, ReactNode, useEffect, useState } from "react";

import { auth } from "@/auth/firebaseClient";

// Maximum session duration in days
const SESSION_DURATION_DAYS = 7;

interface AuthContextType {
  user: FirebaseUser | null;
}

// Create a context for authentication with the proper type
export const AuthContext = createContext<AuthContextType>({ user: null });

/**
 * AuthProvider component to provide auth context
 */
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    // Set the session start time in local storage if it doesn't exist
    let sessionStart = localStorage.getItem("sessionStart");
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      localStorage.setItem("sessionStart", Date.now().toString());
    }
    const sessionStartTimestamp = parseInt(sessionStart, 10);

    // Listen for changes in the ID token
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Calculate the session duration
        const now = Date.now();
        const sessionDurationMs = now - sessionStartTimestamp;
        const maxDurationMs = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

        if (sessionDurationMs > maxDurationMs) {
          // Session expired, sign out the user
          await signOut(auth);
          Cookies.remove("token");
          localStorage.removeItem("sessionStart");
          setUser(null);
          console.log("Session expired.");
          return;
        }

        // Get a fresh token and update the cookie
        const token = await firebaseUser.getIdToken();
        Cookies.set("token", token, { expires: SESSION_DURATION_DAYS });
        setUser(firebaseUser);
      } else {
        // Remove the token and session start time if the user is not authenticated
        Cookies.remove("token");
        localStorage.removeItem("sessionStart");
        setUser(null);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
