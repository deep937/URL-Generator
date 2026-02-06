"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import { 
  ArrowLeft, Globe, MousePointer2, 
  Calendar, Zap, Copy, Check, Trash2, QrCode, Download
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LinkDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", id)
        .single();

      if (error) router.push("/dashboard");
      else setItem(data);
      setLoading(false);
    };
    fetchItem();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Permanently delete this entry?")) return;
    const { error } = await supabase.from("urls").delete().eq("id", id);
    if (!error) router.push("/dashboard");
  };

  const chartData = useMemo(() => {
    if (!item) return [];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateString: d.toLocaleDateString(),
        value: 0
      });
    }
    const createdDate = new Date(item.created_at).toLocaleDateString();
    return days.map(day => {
      if (day.dateString === createdDate) {
        return { ...day, value: item.clicks || 0 };
      }
      return day;
    });
  }, [item]);

  const copyLink = () => {
    const fullUrl = `${window.location.origin}/r/${item.short_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-analytics");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR-Asset.png`;
      downloadLink.click();
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-8 lg:p-20 space-y-10">
      
      {/* NAVIGATION & DELETE */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[12px] font-black text-green-800 uppercase tracking-[0.3em] hover:text-blue-600 transition-all"
        >
          <ArrowLeft size={32} /> Back to Dashboard
        </button>

        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
        >
          <Trash2 size={16} /> Delete URL
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-300 p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-center">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Destination URL</span>
            <h2 className="text-2xl font-bold text-slate-800 break-all">{item.long_url}</h2>
          </div>
          
          {item.short_url && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="font-mono text-sm text-blue-600 font-bold">
                {window.location.host}/r/{item.short_url}
              </span>
              <button onClick={copyLink} className="text-slate-400 hover:text-blue-600 transition-colors">
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </button>
            </div>
          )}
        </div>

        <div className="bg-yellow-400 p-10 rounded-[3rem] text-white flex flex-col justify-center items-center text-center shadow-xl shadow-yellow-200/50">
          <MousePointer2 size={32} className="mb-4 opacity-50" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Link Clicks</p>
          <h3 className="text-7xl font-black tracking-tighter">{item.clicks || 0}</h3>
        </div>
      </div>

      {/* GRAPH ROW - CONDITIONAL QR DISPLAY */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Only show QR if it's NOT a short link asset */}
        {!item.short_url && (
          <div className="w-full lg:w-80 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-6 shrink-0">
            <div className="text-center">
              <QrCode size={20} className="mx-auto text-blue-600 mb-1" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">QR Asset</h3>
            </div>
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
              <QRCodeCanvas 
                id="qr-analytics"
                value={item.long_url} 
                size={140}
                level="H"
                includeMargin={true}
              />
            </div>
            <button onClick={downloadQR} className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
              <Download size={14} /> Download PNG
            </button>
          </div>
        )}

        {/* GRAPH - EXPANDS IF QR IS HIDDEN */}
        <div className={`flex-1 bg-slate-300 p-10 rounded-[3rem] border border-slate-100 shadow-sm`}>
          <div className="mb-8 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Usage Graph</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 800, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 800, fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fill="url(#colorReal)" dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}