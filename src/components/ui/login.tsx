"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // if already logged in, bounce to home
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.replace("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Account created! Check your email to confirm, or sign in now.",
        );
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-950 overflow-hidden">
      {/* ── ambient blobs ── */}
      <div className="absolute top-[-180px] left-[-180px] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-150px] w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

      {/* ── back to home ── */}
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm z-10"
      >
        <Home className="w-4 h-4" />
        Home
      </Link>

      {/* ── card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        <Card
          className="relative overflow-hidden border-0 shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.98) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <BorderBeam size={350} duration={10} delay={2} />

          <div className="relative z-10 px-8 py-10 flex flex-col gap-6">
            {/* logo + headline */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 border border-gray-700">
                  <span className="text-sm font-bold text-white">PS</span>
                </span>
                <span className="text-xl font-semibold text-white">
                  Property<span className="text-purple-400">Salahe</span>
                </span>
              </div>

              <AnimatedGradientText>
                <span className="text-sm font-medium">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </span>
              </AnimatedGradientText>

              <p className="text-gray-500 text-sm text-center leading-relaxed max-w-xs">
                {mode === "login"
                  ? "Sign in to manage and list your properties."
                  : "Join Property Salahe and start listing properties today."}
              </p>
            </div>

            {/* mode toggle pills */}
            <div className="flex self-center bg-gray-800/60 rounded-lg p-1 gap-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      mode === m
                        ? "bg-gray-700 text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                >
                  {m === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            {/* alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* fields */}
            <div className="flex flex-col gap-4">
              {/* email */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="pl-10 bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* password */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="pl-10 pr-10 bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* confirm password — only on register */}
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  <Label className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="pl-10 pr-10 bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <ShimmerButton
              className="w-full shadow-lg mt-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2 text-sm font-semibold text-white px-4 py-2.5">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === "login" ? "Signing in…" : "Creating account…"}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </ShimmerButton>

            {/* switch mode link */}
            <p className="text-center text-gray-500 text-sm">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={switchMode}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
