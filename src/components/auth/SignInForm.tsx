"use client";

import clsx from "clsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/auth/firebaseClient";

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

  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", firebaseError: "" });
  };

  // Handle sign in with email and password
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", firebaseError: "" });

    // Basic form validation
    if (!form.email || !form.password) {
      setErrors({
        ...errors,
        email: !form.email ? "Email is required." : "",
        password: !form.password ? "Password is required." : "",
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      // Add the token to cookies for 1 day
      const token = await userCredential.user.getIdToken();
      Cookies.set("token", token, { expires: 1 });
      router.push("/calendar");
    } catch (error) {
      console.error("Error with Google sign in", error);
      setErrors({ ...errors, firebaseError: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignin}
      className="flex w-full flex-col items-center space-y-4 rounded-xl border border-neutral-800 p-4"
    >
      <div className="flex w-full flex-col gap-2 border-b border-neutral-400">
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
          required
        />
        {errors.email && (
          <p className="py-2 pl-4 text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 border-b border-neutral-400">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={clsx("w-full rounded-xl border px-4 py-2 outline-none", {
            "border-transparent": !errors.email,
            "border-red-500": errors.email,
          })}
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
        {loading ? "Signing in..." : "Sign In"}
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
