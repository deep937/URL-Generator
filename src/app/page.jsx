"use client";

import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  BarChart3, 
  Fingerprint, 
  Command, 
  MousePointer2 
} from "lucide-react";

export default function HomePage() {
  const demoLink = "https://urlgen.app/r/aB3xP9";

  return (
    <div className="h-screen bg-[#f8fafc] text-slate-900 flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white relative">
      
      {/* 1. LAYERED BACKGROUND ARCHITECTURE */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-250 h-250 rounded-full bg-blue-100/30 blur-[120px] animate-slow-spin" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="grow flex items-center justify-center px-8 py-4 mt-8">
        <div className="max-w-350 w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT COLUMN: LARGE BRANDING & ACTIONS */}
          <div className="space-y-10 text-left">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200">
                <Command size={12} className="text-blue-400" />
                Intelligence Engine v2.0
              </div>
            
              <div className="space-y-2">
                <h1 className="text-[70px] md:text-7xl font-black tracking-[-0.05em] text-slate-900 leading-[0.85] italic uppercase">
                  URL <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-400 bg-clip-text text-transparent">GENERATOR</span>
                </h1>
                <div className="flex items-center gap-3 ml-1 mt-2">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_#34d399]" />
                  <span className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-[0.35em] italic">
                    & QR CODE ENGINE
                  </span>
                </div>
              </div>

              <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                The elite standard for link shortening and 
                <span className="text-slate-900 font-bold italic"> digital asset tracking.</span> Transform stagnant links into high-performance tracking engines instantly.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/generate"
                className="group px-10 py-5 rounded-2xl bg-blue-600 text-white text-[12px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:scale-105 flex items-center gap-10 shadow-2xl shadow-blue-200"
              >
                Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              
            </div>

            {/* INTEGRATED MINI FEATURES */}
            <div className="flex gap-10 pt-6 border-t border-slate-200/60">
               <MiniFeature icon={<Zap size={18}/>} title="30ms" label="Redirect" />
               <MiniFeature icon={<BarChart3 size={18}/>} title="Real" label="Data" />
               <MiniFeature icon={<Shield size={18}/>} title="SSL" label="Secure" />
            </div>
          </div>

          {/* RIGHT COLUMN: PREVIEW BENTO */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/10 blur-[100px] rounded-full animate-pulse" />
            <div className="relative bg-white border-2 border-slate-100 rounded-[4rem] shadow-2xl p-10 overflow-hidden">
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                  <div className="space-y-1">
                    <div className="w-12 h-1.5 bg-blue-600 rounded-full mb-2" />
                    <h3 className="text-3xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">
                      Live Preview
                    </h3>
                  </div>
                  <div className="flex gap-6">
                    <StatItem label="Users" value="240k+" />
                    <StatItem label="Links" value="1.2M" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center gap-8 border border-slate-100">
                  <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 group-hover:rotate-2 transition-transform duration-700">
                    <QRCodeCanvas value={demoLink} size={160} level="H" />
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 text-[12px] font-mono text-blue-600 font-bold text-center truncate shadow-inner">
                      {demoLink}
                    </div>
                    <button className="w-full bg-slate-900 text-white text-[10px] py-5 rounded-2xl text-center uppercase font-black tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-lg">
                      Copy Generated Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx global>{`
        @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-slow-spin { animation: slow-spin 30s linear infinite; }
      `}</style>
    </div>
  );
}

function MiniFeature({ icon, title, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-500">{icon}</div>
      <div className="leading-none">
        <p className="text-sm font-black text-slate-900 uppercase italic">{title}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="text-right">
      <span className="text-2xl font-black italic text-slate-900 leading-none block">{value}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}