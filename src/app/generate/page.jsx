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
  ExternalLink 
} from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
    }
  }, [router]);

  // Generate a random 6-character code
  const generateShortUrl = () => Math.random().toString(36).substring(2, 8);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setLoading(true);
    // Reset shortUrl so the card hides and re-animates if generating a new one
    setShortUrl(""); 

    const code = generateShortUrl();

    // Ensure your table name is "urls" and columns match exactly
    const { error } = await supabase.from("urls").insert({
      long_url: longUrl,
      short_url: code,
      user_id: user.id,
      clicks: 0,
      is_active: true,
    });

    if (error) {
      console.error("DB ERROR:", error.message);
      alert("Error: " + error.message); // Added for visibility during debugging
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
    // Changed bg color to ensure text contrast and fixed scrolling for long results
    <div className="min-h-screen bg-[#abc7df] flex flex-col items-center justify-center px-4 py-20 relative overflow-y-auto">
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <div className="fixed top-8 left-0 right-0 px-8 flex justify-between items-center max-w-7xl mx-auto w-full z-50">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm group"
        >
          <LayoutDashboard size={16} className="text-blue-600 group-hover:text-white transition-colors" /> 
          Dashboard
        </button>
      </div>

      <div className="w-full max-w-xl">
        <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl mb-2 rotate-3 transition-transform">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Generate Short Link</h1>
              <p className="text-slate-500 font-medium">Turn long URLs into clickable assets.</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <input
              type="url"
              placeholder="https://example.com/very-long-link"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (shortUrl) setShortUrl(""); // Clear previous result if user types new URL
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Shorten Link <Sparkles size={20} /></>}
            </button>
          </form>

          {/* RESULT CARD - Ensure this is rendered when shortUrl exists */}
          {shortUrl && (
            <div className="pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center space-y-6 shadow-2xl">
                <div className="text-center space-y-2 w-full">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Success! Your link is ready</p>
                  <p className="text-xl font-mono font-bold break-all bg-white/5 py-3 px-4 rounded-xl border border-white/10">
                    {typeof window !== 'undefined' ? window.location.host : ''}/r/{shortUrl}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${
                      copied ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied" : "Copy"}
                  </button>

                  <button
                    onClick={handleOpenLink}
                    className="flex items-center justify-center gap-2 px-4 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
                  >
                    <ExternalLink size={18} /> Visit
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