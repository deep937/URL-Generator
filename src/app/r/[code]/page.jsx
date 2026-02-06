"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { Zap, ShieldCheck } from "lucide-react";

export default function DirectRedirect() {
  const { code } = useParams();

  useEffect(() => {
    const directRedirect = async () => {
      // 1. Immediate Lookup
      const { data, error } = await supabase
        .from("urls")
        .select("id, long_url, clicks")
        .eq("short_url", code)
        .single();

      if (error || !data) {
        window.location.assign("/404");
        return;
      }

      // 2. Background analytics update
      supabase
        .from("urls")
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq("id", data.id)
        .then();

      // 3. The Hyper-Space Transition
      setTimeout(() => {
        const newTab = window.open(data.long_url, "_blank");
        
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          window.location.assign(data.long_url);
        } else {
          window.location.assign("/dashboard");
        }
      }, 1200); // Slightly longer to appreciate the high-end animation
    };

    if (code) directRedirect();
  }, [code]);

  return (
    /* fixed inset-0 z-[999] ensures this page covers the Sidebar and Header completely */
    <div className="fixed inset-0 z-999 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      
      {/* --- BACKGROUND DYNAMICS --- */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      </div>

      <div className="relative flex flex-col items-center">
        
        {/* --- THE CORE ENGINE --- */}
        <div className="relative mb-16">
          {/* Orbital Rings */}
          <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[spin_4s_linear_infinite] scale-[2.5]" />
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-[spin_6s_linear_reverse_infinite] scale-[3.5]" />
          
          {/* Glowing Center */}
          <div className="relative w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl flex items-center justify-center text-white shadow-[0_0_80px_rgba(37,99,235,0.6)] border border-white/20 animate-float">
             <Zap size={40} fill="currentColor" className="animate-pulse" />
          </div>

          {/* Floating Particles */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-ping offset-x-10" style={{ top: '-20%', left: '120%' }} />
          <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{ top: '110%', left: '-40%' }} />
        </div>

        {/* --- TEXTUAL BRIDGE --- */}
        <div className="text-center space-y-6 max-w-xs">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
              Securing<br />
              <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Connection</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-emerald-500/60 font-black text-[9px] uppercase tracking-[0.3em]">
              <ShieldCheck size={12} /> SSL Verified Bridge
            </div>
          </div>
          
          {/* High-End Loading Bar */}
          <div className="relative w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mx-auto border border-white/5">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500 to-transparent w-full -translate-x-full animate-hyper-shimmer" />
          </div>
          
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">
            Establishing Protocol
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes hyper-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-hyper-shimmer {
          animation: hyper-shimmer 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}