"use client";

import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowRight, MoveUpRight, Zap, Globe, Shield, Sparkles, BarChart3, Fingerprint, Command } from "lucide-react";

export default function HomePage() {
  const demoLink = "https://urlgen.app/r/aB3xP9";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* 1. LAYERED BACKGROUND ARCHITECTURE */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-250 h-250 rounded-full bg-blue-100/30 blur-[120px] animate-slow-spin" />
        <div className="absolute bottom-[-5%] right-[-5%] w-200 h-200 rounded-full bg-indigo-50/50 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <main className="grow flex flex-col items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-6xl w-full text-center space-y-24">

          {/* Headline Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-xl shadow-blue-200">
              <Command size={12} className="text-blue-400" />
              Intelligence Engine v2.0
            </div>
            
            {/* SIMPLIFIED NAME HEADLINE */}
            <h1 className="text-[120px] md:text-[180px] font-black tracking-[-0.05em] text-slate-900 leading-none italic uppercase">
              URL<span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">GEN</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              The elite standard for link shortening and 
              <span className="text-slate-900 font-bold italic"> digital tracking.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/generate"
              className="group relative px-14 py-7 rounded-2xl bg-blue-600 text-white text-lg font-black uppercase tracking-widest transition-all duration-500 hover:bg-slate-900 hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Get Started Free <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-14 py-7 rounded-2xl bg-white border-2 border-slate-100 text-lg font-black uppercase tracking-widest text-slate-900 hover:border-blue-600 transition-all duration-500 flex items-center gap-3 active:scale-95 shadow-sm"
            >
              Login <Fingerprint className="w-5 h-5 text-slate-400" />
            </Link>
          </div>

          {/* 3. BENTO PREVIEW SECTION */}
          <section className="relative group max-w-5xl mx-auto pt-10">
            <div className="relative bg-white border-2 border-slate-100 rounded-[4rem] shadow-2xl p-2 overflow-hidden transition-all duration-700">
              <div className="bg-slate-50 rounded-[3.8rem] p-10 md:p-16 grid md:grid-cols-2 gap-16 items-center text-left">
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
                    <h3 className="text-5xl font-black text-slate-900 leading-none italic uppercase tracking-tighter">
                      Simple. <br />Powerful.
                    </h3>
                    <p className="text-slate-500 font-medium max-w-xs">Track every click with surgical precision across all platforms.</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 font-mono text-blue-600 font-bold flex justify-between items-center group/link">
                    <span className="truncate">{demoLink}</span>
                    <CopyAction />
                  </div>

                  <div className="flex gap-10">
                    <StatItem label="Active Users" value="240k+" />
                    <StatItem label="Total Links" value="1.2M" />
                  </div>
                </div>

                <div className="relative flex justify-center py-10">
                  <div className="absolute inset-0 bg-blue-400/20 blur-[100px] rounded-full animate-pulse" />
                  <div className="relative bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 transition-all duration-700 group-hover:scale-105">
                    <QRCodeCanvas value={demoLink} size={180} level="H" className="rounded-xl" />
                    <div className="mt-8 text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Encrypted QR</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 4. FEATURES SECTION */}
          <div className="grid md:grid-cols-3 gap-8 pt-12">
            <FeatureCard 
              icon={<Zap size={24} />} 
              title="Edge Speed" 
              text="Redirects processed in 30ms via our global network." 
            />
            <FeatureCard 
              icon={<BarChart3 size={24} />} 
              title="Real Data" 
              text="No sampled data. Get the real count for every visitor." 
            />
            <FeatureCard 
              icon={<Shield size={24} />} 
              title="Secure SSL" 
              text="Bank-grade encryption for all shortened links." 
            />
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

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-black italic text-slate-900 leading-none">{value}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function CopyAction() {
  return (
    <div className="bg-slate-900 text-white text-[9px] px-4 py-2 rounded-xl cursor-pointer uppercase font-black tracking-widest hover:bg-blue-600 transition-all active:scale-90">
      Copy Link
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="group bg-white border-2 border-slate-50 rounded-[2.5rem] p-10 transition-all duration-500 hover:border-blue-100 hover:shadow-xl text-left">
      <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3 italic uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );
}