import { NavLink } from "react-router-dom";
import { Zap, History, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-600 bg-surface-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
            <Zap size={16} className="text-brand" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white font-bold text-lg tracking-tight">Outreach</span>
            <span className="text-brand font-bold text-lg tracking-tight">AI</span>
          </div>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand/10 text-brand border border-brand/20 ml-1">
            AGENT
          </span>
        </NavLink>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-700"
              )
            }
          >
            <BarChart2 size={15} />
            <span className="hidden sm:inline">Analyze</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-700"
              )
            }
          >
            <History size={15} />
            <span className="hidden sm:inline">History</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
