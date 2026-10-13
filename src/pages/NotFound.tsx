import { useNavigate } from "react-router-dom";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-6">
        <Zap size={28} className="text-brand" />
      </div>
      <h1 className="text-5xl font-bold text-white mono mb-2">404</h1>
      <p className="text-slate-400 mb-6">This page doesn't exist.</p>
      <button onClick={() => navigate("/")} className="brand-btn flex items-center gap-2">
        <Home size={16} />
        Back to Dashboard
      </button>
    </div>
  );
}
