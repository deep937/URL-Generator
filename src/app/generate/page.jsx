"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { 
  Link2, 
  Sparkles, 
  Copy, 
  Check, 
  LayoutDashboard, 
  Loader2, 
  ArrowLeft,
  Zap,
  ExternalLink 
} from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const generateShortUrl = () => Math.random().toString(36).substring(2, 8);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const code = generateShortUrl();

    const { error } = await supabase.from("urls").insert({
      long_url: longUrl,
      short_url: code,
      user_id: user.id,
      clicks: 0,
      is_active: true,
    });

    setLoading(false);

    if (error) {
      console.error("DB ERROR:", error);
    } else {
      setShortUrl(code);
      // setLongUrl(""); // Line removed to keep input link visible in input box
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}/r/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    const fullUrl = `${window.location.origin}/r/${shortUrl}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#abc7df] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-linear-to-br from-blue-100 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-linear-to-tr from-indigo-100 to-transparent blur-[120px]" />
      </div>

      <div className="absolute top-8 left-8 right-8 flex justify-between items-center max-w-7xl mx-auto w-full pointer-events-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm group"
        >
          <LayoutDashboard size={16} className="text-blue-600 group-hover:text-white transition-colors" /> 
          Go to Dashboard
        </button>
      </div>

      <div className="w-full max-w-xl relative">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-10"></div>
        
        <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-200 mb-2 rotate-3 hover:rotate-0 transition-transform">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Generate Short Link</h1>
              <p className="text-slate-500 font-medium">Turn long URLs into clean, clickable assets.</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative">
              <input
                type="url"
                placeholder="https://example.com/very-long-link"
                required
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value);
                  if (shortUrl) setShortUrl("");
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-slate-200 hover:shadow-blue-200 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Shorten Link <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
          </form>

          {shortUrl && (
            <div className="pt-8 border-t border-slate-100 animate-in fade-in zoom-in duration-500">
              <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-4xl p-8 text-white flex flex-col items-center space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Ready to Share</p>
                  <p className="text-xl font-mono font-bold break-all">
                    {typeof window !== 'undefined' ? window.location.host : ''}/r/{shortUrl}
                  </p>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 ${
                        copied 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>

                    <button
                      onClick={handleOpenLink}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg active:scale-95"
                    >
                      <ExternalLink size={18} /> Open Link
                    </button>
                  </div>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95 w-full"
                  >
                    <LayoutDashboard size={18} /> My Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}