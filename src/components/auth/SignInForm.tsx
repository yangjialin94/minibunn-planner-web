"use client";

import clsx from "clsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/auth/firebaseClient";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrorParser";

/**
 * Sign In Form
 */
function SignInForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebaseError: "",
  });
  const [loading, setLoading] = useState(false);

  // Next.js router for navigation
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", firebaseError: "" });
  };

  // Handle sign in with email and password
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!form.email || !form.password) {
      setErrors({
        email: !form.email ? "Email is required." : "",
        password: !form.password ? "Password is required." : "",
        firebaseError: "",
      });
      return;
    }

    setErrors({ email: "", password: "", firebaseError: "" });

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      // User data will be automatically fetched and set by AuthProvider
      router.push("/calendar");
    } catch (error) {
      console.error("Error with Email and Password sign in", error);
      setErrors({
        email: "",
        password: "",
        firebaseError: getFirebaseErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignin}
      className="flex w-full flex-col items-center space-y-4 rounded-xl border border-neutral-300 p-4"
    >
      <div className="flex w-full flex-col gap-2 border-b border-neutral-300">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={clsx("w-full rounded-xl border px-4 py-2 outline-none", {
            "border-transparent": !errors.email,
            "border-red-500": errors.email,
          })}
        />
        {errors.email && (
          <p className="py-2 pl-4 text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 border-b border-neutral-300">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={clsx("w-full rounded-xl border px-4 py-2 outline-none", {
            "border-transparent": !errors.password,
            "border-red-500": errors.password,
          })}
        />
        {errors.password && (
          <p className="py-2 pl-4 text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-full border border-transparent bg-white py-2 font-semibold hover:border-neutral-300 hover:bg-neutral-300"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {errors.firebaseError && (
        <p className="text-center text-sm text-red-500">
          {errors.firebaseError}
        </p>
      )}
    </form>
  );
}

export default SignInForm;
