"use client";

import { useQueryClient } from "@tanstack/react-query";
import { onIdTokenChanged, signOut, User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Handle firebase token changes
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const lastSignIn = firebaseUser.metadata?.lastSignInTime;

        if (lastSignIn) {
          const lastSignInDate = new Date(lastSignIn).getTime();
          const now = Date.now();
          const maxDurationMs = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

          if (now - lastSignInDate > maxDurationMs) {
            // Session expired
            await signOut(auth);
            Cookies.remove("token");
            setUser(null);
            router.push("/");

            console.warn("Session expired.");
            return;
          }
        }

        // Update the token and cookie
        const token = await firebaseUser.getIdToken();
        Cookies.set("token", token, { expires: SESSION_DURATION_DAYS });
        setUser(firebaseUser);

        // Invalidate React Query cache
        queryClient.invalidateQueries();
      } else {
        // User is signed out
        Cookies.remove("token");
        setUser(null);
        router.replace("/");

        console.warn("No user — signed out.");
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [queryClient, router]);

  // Redirect to home if no token and on a protected route
  useEffect(() => {
    const token = Cookies.get("token");
    const isProtectedRoute = pathname === "/" || pathname.startsWith("/auth");

    if (typeof window !== "undefined" && !token && !isProtectedRoute) {
      console.warn("No token — redirecting to home");
      router.replace("/");
    }
  }, [pathname, router, user]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
