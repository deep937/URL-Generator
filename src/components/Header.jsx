"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ChevronDown,
  Activity,
  LayoutDashboard,
  LogOut
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // --- ADDED: Hide Header on Login and Register pages ---
  const noHeaderPages = ["/login", "/register"];
  if (noHeaderPages.includes(pathname)) {
    return null; 
  }

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-130 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 lg:pl-16 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center relative">
        
        {/* 1. LEFT: SYSTEM STATUS */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Live</span>
          </div>
        </div>

        {/* 2. CENTER: BRANDING */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center select-none cursor-default text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase whitespace-nowrap">
              URL <span className="bg-linear-to-r from-blue-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">Generator</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 -mt-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] whitespace-nowrap">
              & QR Code Engine
            </span>
          </div>
        </div>

        {/* 3. RIGHT: PROFILE */}
        <div className="relative" ref={profileRef}>
          {user ? (
            <>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 bg-slate-50 border border-slate-200 rounded-full hover:border-blue-300 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm uppercase">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest hidden sm:block">
                  {user.name ? user.name.split(' ')[0] : 'User'}
                </span>
                <ChevronDown size={12} className={`text-slate-300 mr-1 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-72 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="h-20 bg-slate-50 border-b border-slate-100 flex items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                            <User size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{user.name}</h4>
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-[11px] font-medium text-slate-600 truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100/30">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Verified Account</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                        <button 
                            onClick={() => { router.push('/dashboard'); setIsProfileOpen(false); }}
                            className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors group"
                        >
                            <LayoutDashboard size={14} className="group-hover:text-blue-500" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Dashboard</span>
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
                        >
                            <LogOut size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Log Out</span>
                        </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
              Login 
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}