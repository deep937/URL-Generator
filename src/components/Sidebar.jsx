"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  LayoutGrid, 
  Link2, 
  QrCode, 
  LogOut,
  LogIn 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sidebarRef = useRef(null);

  // Sync login status and handle outside clicks
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pathname]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      router.push("/login");
    } else {
      router.push("/login");
    }
    setIsOpen(false);
  };

  const menuItems = [
    { label: "HOME", path: "/", icon: <Home size={20} />, color: "text-blue-400", bg: "bg-blue-500", shadow: "shadow-[4px_0_15px_rgba(59,130,246,0.5)]" },
    { label: "DASHBOARD", path: "/dashboard", icon: <LayoutGrid size={20} />, color: "text-violet-400", bg: "bg-violet-500", shadow: "shadow-[4px_0_15px_rgba(139,92,246,0.5)]" },
    { label: "CREATE SHORT LINKS", path: "/generate", icon: <Link2 size={20} />, color: "text-emerald-400", bg: "bg-emerald-500", shadow: "shadow-[4px_0_15px_rgba(16,185,129,0.4)]" },
    { label: "CREATE QR CODES", path: "/qr", icon: <QrCode size={20} />, color: "text-orange-400", bg: "bg-orange-500", shadow: "shadow-[4px_0_15px_rgba(249,115,22,0.4)]" },
  ];

  return (
    <>
      {/* Background Overlay with 20px blur */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-20p transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen z-150 bg-[#2d3748] border-r border-white/5 transition-all duration-500 ease-in-out flex flex-col ${
          isOpen ? "w-76" : "w-20"
        }`}
      >
        <div className="h-24 flex items-center justify-center border-b border-white/5">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 p-4 group"
          >
            <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 rotate-45 translate-y-2" : "w-4"}`} />
            <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "w-6"}`} />
            <div className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 -rotate-45 -translate-y-2" : "w-3"}`} />
          </button>
        </div>

        <nav className="flex-1 py-10 flex flex-col">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center h-16 transition-all relative z-10 ${
                  active ? "bg-white/5" : "hover:bg-white/2"
                }`}
              >
                {/* --- VERTICAL COLOR CANDLE --- */}
                {active && (
                  <div className={`absolute left-0 w-1.5 h-10 rounded-r-xl z-20 ${item.bg} ${item.shadow}`} />
                )}

                <div className={`w-20 shrink-0 flex items-center justify-center transition-colors ${
                  active ? item.color : "text-white/40"
                }`}>
                  {item.icon}
                </div>

                <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"
                }`}>
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                    active ? "text-white" : "text-white/60"
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* --- ROUNDED RECTANGLE AUTH AREA --- */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleAuthAction}
            className={`w-full flex items-center h-14 rounded-2xl transition-all duration-300 overflow-hidden group border ${
              isLoggedIn 
                ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" 
                : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <div className="w-14 shrink-0 flex items-center justify-center">
              {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
            </div>
            <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}>
              <span className="text-[12px] font-black uppercase tracking-widest">
                {isLoggedIn ? "LOG OUT" : "LOG IN"}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}