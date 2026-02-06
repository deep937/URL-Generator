"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
// Added ArrowLeft and Grid for the new buttons
import { QrCode, Download, LayoutDashboard, Link as LinkIcon, Loader2, Sparkles, ArrowLeft, Grid } from "lucide-react";

export default function QRPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) return null;

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      router.push("/login");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("urls").insert({
      long_url: url,
      short_url: null,
      user_id: user.id,
      clicks: 0,
      is_active: true,
    });

    setLoading(false);

    if (error) {
      console.error("DB ERROR:", error);
    } else {
      setShowQR(true);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* --- NEW: TOP NAVIGATION BAR --- */}
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
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-100 mb-4 animate-float">
              <QrCode size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">QR Generator</h1>
            <p className="text-slate-500 font-medium italic">Transform any URL into a scannable asset</p>
          </div>

          <form onSubmit={handleGenerateQR} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <LinkIcon size={18} />
              </div>
              <input
                type="url"
                placeholder="https://example.com"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none text-slate-900 font-medium"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setShowQR(false);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Generate Now <Sparkles size={18} /></>}
            </button>
          </form>

          {showQR && (
            <div className="pt-8 border-t border-slate-50 animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-50 rounded-4xl p-8 border border-slate-100 flex flex-col items-center space-y-6">
                <div className="p-4 bg-white rounded-3xl shadow-md border border-slate-100">
                  <QRCodeCanvas id="qr-code" value={url} size={200} level="H" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <button
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    <Download size={18} /> Download
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    <LayoutDashboard size={18} /> View in Dashboard
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