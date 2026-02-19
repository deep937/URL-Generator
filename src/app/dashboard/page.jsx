"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import { 
  QrCode, Trash2, Copy, Check, X, 
  Zap, Plus, RefreshCw, MousePointer2, BarChart2,
  User as UserIcon
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("links"); 
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [userName, setUserName] = useState("User");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) { router.push("/login"); return; }
      const user = JSON.parse(userData);
      if (user.name) setUserName(user.name);

      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err) {
      console.error("Load Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this entry?")) return;
    const { error } = await supabase.from("urls").delete().eq("id", id);
    if (!error) {
      setLinks(prev => prev.filter(link => link.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/r/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = links.filter(item => 
    activeTab === "links" ? item.short_url : !item.short_url
  );

  return (
    <div className="min-h-screen bg-[#b5c9dc] pb-20">
      <div className="absolute top-0 left-0 w-full h-72 bg-slate-900 -z-10 rounded-b-[4rem]" />

      <div className="max-w-7xl mx-auto px-6 pt-16 space-y-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <UserIcon size={18} />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]">Personal Workspace</p>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight uppercase italic">
              Hello, <span className="bg-linear-to-r from-blue-500 to-emerald-200 bg-clip-text text-transparent">{userName}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchItems} className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all">
              <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
            </button>
            <Link href="/generate" className="flex items-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-2xl transition-all">
              <Plus size={18} /> Create Link
            </Link>
            <Link href="/qr" className="flex items-center gap-3 px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 shadow-2xl transition-all">
              <QrCode size={18} /> Create QR
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {["links", "qr"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab === "links" ? "Short Links" : "QR Codes"}
            </button>
          ))}
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="h-72 bg-white rounded-[2.5rem] border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border border-slate-200 shadow-sm">
                <Zap className="mx-auto mb-6 text-slate-200" size={56} />
                <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">No active entries found</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 py-10 transition-all hover:border-blue-400 flex flex-col justify-between shadow-sm min-h-85">
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                        {item.short_url ? <Zap size={22} className="text-blue-500" /> : <QrCode size={22} className="text-emerald-500" />}
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={22} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Original Destination</p>
                      <h3 className="font-bold text-slate-800 text-base break-all leading-snug">{item.long_url}</h3>
                    </div>

                    {item.short_url && (
                      <div className="flex items-start justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 min-h-15">
                        <span className="text-sm font-mono font-bold text-blue-600 break-all leading-relaxed pr-3">
                          {window.location.host}/r/{item.short_url}
                        </span>
                        <button onClick={() => copyToClipboard(item.short_url, item.id)} className="text-blue-400 hover:text-blue-700 transition-colors shrink-0 pt-1">
                          {copiedId === item.id ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      {/* CONDITIONAL: Only show hits for Short Links */}
                      {item.short_url && (
                        <>
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <MousePointer2 size={16} className="text-blue-500" />
                          </div>
                          <span className="text-sm font-black text-slate-700">{item.clicks || 0} hits</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      {!item.short_url && (
                        <button 
                          onClick={() => setSelectedItem(item)} 
                          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <QrCode size={20} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => router.push(`/analytics/${item.id}`)}
                        className="p-3 px-6 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-slate-200"
                      >
                        <BarChart2 size={20} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Analyse</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- QR MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white rounded-[3rem] p-10 max-w-sm w-full space-y-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Asset Intelligence QR</h3>
              <button onClick={() => setSelectedItem(null)} className="p-1 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex justify-center p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <QRCodeCanvas 
                id={`qr-${selectedItem.id}`}
                value={selectedItem.short_url ? `${window.location.origin}/r/${selectedItem.short_url}` : selectedItem.long_url} 
                size={200}
                level="H"
              />
            </div>

            <button onClick={() => {
              const canvas = document.getElementById(`qr-${selectedItem.id}`);
              const link = document.createElement('a');
              link.download = 'QR-Asset.png';
              link.href = canvas.toDataURL();
              link.click();
            }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-600 transition-all shadow-xl">
              Export PNG Asset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}