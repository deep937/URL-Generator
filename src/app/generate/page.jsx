"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { 
  Sparkles, 
  Copy, 
  Check, 
  LayoutDashboard, 
  Loader2, 
  ArrowLeft,
  Zap,
  Grid,
  ExternalLink,
  Link as LinkIcon
} from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) return null;

  const generateShortUrl = () => Math.random().toString(36).substring(2, 8);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setShortUrl(""); 

    const code = generateShortUrl();

    const { error } = await supabase.from("urls").insert({
      long_url: longUrl,
      short_url: code,
      user_id: user.id,
      clicks: 0,
      is_active: true,
    });

    if (error) {
      console.error("DB ERROR:", error.message);
    } else {
      setShortUrl(code);
    }
    setLoading(false);
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
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="pointer-events-auto flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <button 
          onClick={() => router.push("/dashboard")}
          className="pointer-events-auto flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all bg-white shadow-sm px-4 py-2 rounded-xl border border-blue-100"
        >
          <Grid size={16} /> Go to Dashboard
        </button>
      </div>

      <div className="w-full max-w-xl relative">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/20 blur-[100px] -z-10" />

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-8 md:p-12 space-y-8">
          
          {/* Header Section matching QR Style */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-100 mb-4 animate-float">
              <Zap size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shorten URL</h1>
            <p className="text-slate-500 font-medium italic">Transform any long link into a clean asset</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <LinkIcon size={18} />
              </div>
              <input
                type="url"
                placeholder="https://example.com/very-long-url"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium"
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
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all duration-500 shadow-xl shadow-slate-200 hover:shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Generate Link <Sparkles size={18} /></>}
            </button>
          </form>

          {shortUrl && (
            <div className="pt-8 border-t border-slate-50 animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center space-y-6">
                
                <div className="text-center space-y-2 w-full">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Shortened Link Ready</p>
                   <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                     <p className="text-base font-mono font-bold break-all text-slate-800">
                       {window.location.host}/r/{shortUrl}
                     </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg ${
                      copied ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-slate-100"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>

                  <button
                    onClick={handleOpenLink}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    <ExternalLink size={18} /> Visit Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}