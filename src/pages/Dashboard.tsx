import { useState } from "react";
import { toast } from "sonner";
import type { AnalysisInput, AnalysisResult } from "@/types";
import { analyzeAndGenerate } from "@/lib/agentEngine";
import { saveToHistory } from "@/lib/historyStore";
import AnalysisForm from "@/components/features/AnalysisForm";
import ResultPanel from "@/components/features/ResultPanel";
import ScanningState from "@/components/features/ScanningState";
import EmptyState from "@/components/features/EmptyState";
import { getHistory } from "@/lib/historyStore";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const navigate = useNavigate();

  const recentHistory = getHistory().slice(0, 3);

  async function handleSubmit(input: AnalysisInput) {
    setLoading(true);
    setResult(null);
    console.log("Running analysis for:", input);
    try {
      const res = await analyzeAndGenerate(input);
      console.log("Analysis result:", res);
      setResult(res);
      saveToHistory(res);
      toast.success(`Analysis complete for ${input.businessName}`);
    } catch (err) {
      console.error("Analysis failed:", err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Client Acquisition Agent
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Enter a business to analyze their online presence and generate a personalized outreach message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Form + Recent */}
        <div className="space-y-6">
          <AnalysisForm onSubmit={handleSubmit} loading={loading} />

          {/* Recent Analyses */}
          {recentHistory.length > 0 && (
            <div className="glass-panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Recent
                  </span>
                </div>
                <button
                  onClick={() => navigate("/history")}
                  className="text-xs text-brand hover:text-brand-dim transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {recentHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setResult(item)}
                    className="w-full flex items-center justify-between p-3 rounded-lg glass-panel-inner hover:border-brand/30 transition-all text-left group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-brand transition-colors">
                        {item.input.businessName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.input.location || item.input.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-brand mono">{item.confidence_score}%</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(item.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div className="lg:sticky lg:top-24">
          {loading ? (
            <ScanningState />
          ) : result ? (
            <ResultPanel result={result} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
