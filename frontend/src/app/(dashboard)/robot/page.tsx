"use client";

import { Bot, Battery, Zap, AlertCircle, Wifi, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function RobotStatusPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get("/dashboard/summary");
        setStatus(data.robot_status);
      } catch (error) {
        console.error("Failed to load robot status", error);
      }
    };
    fetchStatus();
    const intv = setInterval(fetchStatus, 5000);
    return () => clearInterval(intv);
  }, []);

  if (!status) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">UGV Diagnostics</h1>
          <p className="text-gray-400">Live telemetry and health monitoring.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
          <Wifi className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-semibold">Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Status Block */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 bg-gray-950 rounded-full flex items-center justify-center border-4 border-gray-800 relative shadow-inner">
               <Bot className={`w-24 h-24 ${status.current_state === 'SCANNING' ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-gray-500'}`} />
            </div>
            
            <div className="flex-1 space-y-6 w-full">
              <div>
                <h3 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-sm">System State</h3>
                <div className="text-4xl font-black text-white px-4 py-2 bg-gray-950 inline-block rounded-xl border border-gray-800">
                  {status.current_state}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Current Row</p>
                    <p className="text-lg font-bold text-white tracking-wide">{status.current_row || "IDLE"}</p>
                  </div>
                </div>
                
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Errors</p>
                    <p className="text-lg font-bold text-white tracking-wide">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Battery Block */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
           <Zap className="absolute -top-10 -right-10 w-48 h-48 text-gray-800/30 -mx-10" />
           
           <h3 className="text-gray-400 font-medium mb-6 uppercase tracking-wider text-sm z-10 w-full text-left">Power Core</h3>
           
           <div className="relative w-full h-64 bg-gray-950 rounded-2xl border-4 border-gray-800 p-2 z-10 flex items-end">
             {/* Battery Terminal */}
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-t-lg"></div>
             
             {/* Battery Fluid */}
             <div 
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-xl transition-all duration-1000 ease-in-out relative flex items-center justify-center"
                style={{ height: `${status.battery_level}%` }}
             >
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 Mix-blend-overlay"></div>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none text-white drop-shadow-md">
               <span className="text-4xl font-black">{status.battery_level}%</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
