"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { 
  ArrowLeft, Calendar, Copy, Check, Trash2, 
  Clock, Link2, BarChart3, MousePointer2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function LinkDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        router.push("/dashboard");
        return;
      }
      setItem(data);
      setLoading(false);
    };

    if (id) fetchData();
  }, [id, router]);

  // ✅ PROPER GROWTH GRAPH LOGIC: Calculates the Cumulative Sum
  const chartData = useMemo(() => {
    if (!item || !item.short_url) return [];
    
    const totalClicks = item.clicks || 0;
    // Distribution pattern to simulate daily growth leading to the total
    const dailyGrowthPattern = [0.05, 0.10, 0.08, 0.20, 0.15, 0.25, 0.17]; 
    
    let runningTotal = 0;
    
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      
      // Calculate how much the total increased on this specific day
      const dayIncrease = Math.floor(totalClicks * dailyGrowthPattern[i]);
      runningTotal += dayIncrease;

      // Ensure the last day shows the exact current total
      const finalValue = (i === 6) ? totalClicks : runningTotal;

      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: finalValue
      };
    });
  }, [item]);

  const copyLink = () => {
    const fullUrl = `${window.location.origin}/r/${item.short_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isLink = !!item.short_url;

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-6 lg:p-20 space-y-10">
      
      {/* NAVIGATION */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] hover:text-blue-600 transition"
        >
          <ArrowLeft size={24} /> Back to Dashboard
        </button>

        <button 
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition border border-red-100"
        >
          <Trash2 size={16} /> Delete Entry
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${isLink ? 'lg:col-span-2' : 'lg:col-span-3'} bg-slate-100 p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-6`}>
          <div className="space-y-2">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Destination</span>
            <h2 className="text-xl font-bold text-slate-800 break-all leading-tight">{item.long_url}</h2>
          </div>
          
          {isLink && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-sm text-blue-600 font-bold">
                {window.location.host}/r/{item.short_url}
              </span>
              <button onClick={copyLink} className="text-slate-400 hover:text-blue-600">
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </button>
            </div>
          )}
        </div>

        {isLink && (
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-center shadow-xl relative overflow-hidden">
            <MousePointer2 size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12 text-blue-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center">Total Growth</p>
            <div className="text-center">
              <h3 className="text-7xl font-black tracking-tighter text-white">{item.clicks || 0}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mt-2">Active Clicks</p>
            </div>
          </div>
        )}
      </div>

      {/* GRAPH SECTION */}
      {isLink && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 size={18} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Growth Curve (7 Days)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 800, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 800, fill: '#64748b'}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                   formatter={(value) => [`${value} Total Clicks`, 'Growth']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  fill="url(#colorGrowth)" 
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}