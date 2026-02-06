"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Link as LinkIcon, 
  User as UserIcon,
  QrCode,
  Activity
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("User");

  // Sync user name from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUserName(userObj.name || "User");
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
    router.refresh();
  };

  // Hide navbar on Home, Login, and Register pages
  const hideNav = ["/", "/login", "/register"].includes(pathname);
  if (hideNav) return null;

  return (
    <header className="sticky top-0 z-100 w-full border-b-2 border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* --- BRANDING MATCHING DASHBOARD --- */}
        <Link href="/dashboard" className="flex flex-col select-none group">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-slate-900 italic uppercase leading-none">
              URL<span className="bg-linear-to-r from-blue-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">GEN</span>
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
             <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Intelligence</span>
          </div>
        </Link>

        {/* --- NAVIGATION LINKS --- */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavLink 
            href="/dashboard" 
            active={pathname === "/dashboard"} 
            icon={<LayoutDashboard size={16} />} 
            label="Dashboard" 
          />
          <NavLink 
            href="/generate" 
            active={pathname === "/generate"} 
            icon={<PlusCircle size={16} />} 
            label="Create Link" 
          />
          <NavLink 
            href="/qr" 
            active={pathname === "/qr"} 
            icon={<QrCode size={16} />} 
            label="Create QR" 
          />
        </nav>

        {/* --- RIGHT SIDE: USER & LOGOUT --- */}
        <div className="flex items-center gap-4">
          
          {/* System Status (Subtle Dash vibe) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
             <Activity size={12} className="text-blue-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Live Session</span>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

          {/* User Profile Trigger */}
          <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-white border-2 border-slate-50 rounded-2xl shadow-sm group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-transform group-hover:rotate-6">
              <UserIcon size={14} />
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider hidden sm:block">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}

// Sub-component for clean NavLinks
function NavLink({ href, active, icon, label }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active 
          ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}