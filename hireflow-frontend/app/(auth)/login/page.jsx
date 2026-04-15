"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      min-h-screen flex items-center justify-center
      px-4 sm:px-6
      bg-gradient-to-br from-indigo-50 via-white to-blue-50
      relative overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full" />

      {/* CARD */}
      <div className="
        w-full max-w-md
        bg-white/80 backdrop-blur-xl
        border border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        rounded-3xl
        p-5 sm:p-7
        space-y-6
        relative z-10
      ">

        {/* BRANDING */}
        <div className="text-center space-y-2">
          <div className="
            text-xl sm:text-2xl font-semibold tracking-tight
            bg-gradient-to-r from-indigo-600 to-blue-600
            text-transparent bg-clip-text
          ">
            HireFlow
          </div>

          <p className="text-xs sm:text-sm text-zinc-500">
            Smart hiring. Simplified.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >

          {/* HEADER */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Sign in to continue to HireFlow
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="
              text-sm text-red-600
              bg-red-50 border border-red-200
              px-3 py-2 rounded-lg
            ">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              h-10 sm:h-11 rounded-xl
              bg-white/80 backdrop-blur
              border border-zinc-200
              focus-visible:ring-2 focus-visible:ring-indigo-200
              focus-visible:border-indigo-400
            "
          />

          {/* PASSWORD */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                h-10 sm:h-11 rounded-xl pr-12
                bg-white/80 backdrop-blur
                border border-zinc-200
                focus-visible:ring-2 focus-visible:ring-indigo-200
                focus-visible:border-indigo-400
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                text-xs font-medium text-zinc-500 hover:text-zinc-800
              "
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* ACTIONS */}
          <div className="
            flex flex-col sm:flex-row
            gap-2 sm:gap-0
            sm:items-center sm:justify-between
            text-xs text-zinc-500
          ">
            <span className="hover:text-zinc-700 cursor-pointer transition">
              Forgot password?
            </span>

            <span
              onClick={() => router.push("/register")}
              className="hover:text-indigo-600 cursor-pointer transition font-medium"
            >
              Create account
            </span>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="
              w-full h-10 sm:h-11 rounded-xl font-medium
              bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600
              bg-[length:200%_100%]
              text-white
              shadow-md hover:shadow-xl
              transition-all duration-300
              hover:scale-[1.02]
              hover:bg-right
              active:scale-[0.98]
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

        </form>
      </div>
    </div>
  );
}