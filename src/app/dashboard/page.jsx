"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import { 
  Link2, QrCode, Trash2, Copy, Check, Eye, X, 
  Zap, Plus, RefreshCw, MousePointer2, BarChart2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("links"); 
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) { router.push("/login"); return; }
      const user = JSON.parse(userData);

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
    <div className="min-h-screen relative font-sans bg-[#F8FAFC] selection:bg-blue-100 pb-20">
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-blue-100/40 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b-2 border-slate-200/60 pb-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-amber-300 tracking-tighter uppercase italic leading-none">
              Dash<span className="bg-linear-to-r from-blue-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">board</span>
            </h1>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                 Manage your links and QR codes in one place
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchItems}
              className="group flex items-center gap-3 px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            >
              <RefreshCw size={22} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
             
            </button>

            <Link 
              href="/generate"
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
            >
              <Plus size={18} /> Create Link
            </Link>
            <Link 
              href="/qr"
              className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 active:scale-95"
            >
              <QrCode size={18} /> Create QR
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-12">
          {["links", "qr"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? "text-blue-600 border-b-4 border-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab === "links" ? "Shortened Links" : "QR Code Collection"}
            </button>
          ))}
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map(i => (
              <div key={i} className="h-80 bg-white rounded-[3rem] border-2 border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner">
                <Zap className="mx-auto mb-6 text-slate-200" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">No entries found in history</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="group bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
                  
                  <div className="flex items-center justify-center py-6 border-b-2 border-slate-50 mb-8 gap-4">
                    {!item.short_url && (
                      <button 
                        onClick={() => setSelectedItem(item)} 
                        className="flex items-center gap-3 px-8 py-3 bg-blue-50 text-blue-600 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <QrCode size={16} /> QR Code
                      </button>
                    )}
                    
                    <button 
                        onClick={() => handleDelete(item.id)} 
                        className="flex items-center gap-3 px-8 py-3 bg-red-50 text-red-500 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Original Destination</p>
                      <h3 className="font-bold text-slate-800 text-xl truncate px-4">{item.long_url}</h3>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-4xl border-2 border-slate-100 group/link">
                      <span className="text-base font-mono font-bold text-blue-600 truncate mr-4">
                        {item.short_url ? `${window.location.host}/r/${item.short_url}` : "Static Asset Entry"}
                      </span>
                      {item.short_url && (
                        <button onClick={() => copyToClipboard(item.short_url, item.id)} className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                          {copiedId === item.id ? <Check size={24} className="text-emerald-500" /> : <Copy size={24} />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">
                        <MousePointer2 size={18} className="text-blue-500" />
                        <span className="text-sm font-black text-slate-600 uppercase tracking-tighter">{item.clicks || 0} Total Clicks</span>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/analytics/${item.id}`)}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all group/btn"
                      >
                        <BarChart2 size={16} />
                        Analyse
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- SMALLER QR MODAL VIEW --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white rounded-[3rem] p-8 max-w-xs w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300 border border-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">QR Preview</h3>
              <button onClick={() => setSelectedItem(null)} className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="flex justify-center p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
              <QRCodeCanvas 
                id={`qr-${selectedItem.id}`}
                value={selectedItem.long_url} 
                size={160} // Made smaller
                level="H"
                includeMargin={false}
              />
            </div>

            <button onClick={() => {
              const canvas = document.getElementById(`qr-${selectedItem.id}`);
              const link = document.createElement('a');
              link.download = 'QR-Code.png';
              link.href = canvas.toDataURL();
              link.click();
            }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Export PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}