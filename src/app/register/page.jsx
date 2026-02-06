"use client";

import { useState } from "react";
import supabase from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Loader2, Sparkles, Zap, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    const { error } = await supabase.from("app_users").insert({
      name,
      email,
      password, // Note: In a real app, ensure you use Supabase Auth for hashing!
    });

    setLoading(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({ type: "success", msg: "Account created! Redirecting to login..." });
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Mesh Background Decor */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-50/60 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-50/60 blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 italic">
            URL<span className="text-blue-600">GEN</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10">
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join the Elite</h1>
            <p className="text-slate-500 font-medium">Start managing your links like a pro</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {status.msg && (
              <div className={`py-3 px-4 rounded-xl text-sm font-bold text-center animate-in fade-in zoom-in duration-300 ${
                status.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}>
                {status.msg}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-1 mt-1">
                Log in here <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}