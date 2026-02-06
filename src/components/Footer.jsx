"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Link2, Github, Heart, Cpu, Database, Zap } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="w-full bg-black border-t border-white/5  relative overflow-hidden">
      
      {/* Subtle background glow to fill the 'blank' space */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="text-2xl font-black italic uppercase tracking-tighter text-white">
              URL<span className="text-blue-500">Gen</span>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-50">
              Advanced link architecture for high-performance redirection and tracking.
            </p>
          </div>

          {/* Column 2: NEW MIDDLE CONTENT (System Health) */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Infrastructure</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                  <Cpu size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400">Next.js 14 Engine</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <Database size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400">Supabase Cloud</span>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Platform</h4>
            <ul className="text-xs font-bold text-slate-400 space-y-3">
              <li>
                <Link href="/generate" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Zap size={12} /> Generate Link
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <LayoutGrid size={12} /> Asset Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Project */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Status</h4>
            <div className="p-4 bg-white/3 border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Beta</span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 leading-tight">
                Academic Project v2.0 <br /> Solo Developer Release
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Metadata */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="text-slate-500">
            © {new Date().getFullYear()} <span className="text-white">URLGen</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            Handcrafted with <Heart size={10} className="text-red-500 fill-red-500" /> by <span className="text-white">Solo Developer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}