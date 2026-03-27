"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Leaf, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Send JSON (matches backend)
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      await login(data.access_token);
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data);

      // ✅ Extract readable error message
      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Incorrect email or password";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 md:p-10 bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Log in to monitor your field operations.
        </p>

        {/* ✅ Error display (fixed) */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between">
              <label className="text-sm text-gray-300">Password</label>
              <Link href="#" className="text-sm text-emerald-400">
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}