"use client";

import { useAuth } from "@/context/AuthContext";
import { User, Bell } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-800">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white">{user?.full_name || "Operator"}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || "online"}</p>
          </div>
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
