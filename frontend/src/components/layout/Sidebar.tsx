"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Leaf, Bot, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Plant Reports", href: "/plants", icon: Leaf },
  { name: "Robot Status", href: "/robot", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed top-0 left-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">AgriBot</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-gray-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-400 hover:bg-gray-800/50 hover:text-gray-200">
          <Settings className="w-5 h-5 text-gray-500" />
          Settings
        </button>
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
