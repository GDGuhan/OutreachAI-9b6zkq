import { useState } from "react";
import { Trash2, Search, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { getHistory, deleteFromHistory, clearHistory } from "@/lib/historyStore";
import type { AnalysisResult } from "@/types";
import { CATEGORY_LABELS } from "@/constants";
import { formatDate, scoreToColor } from "@/lib/utils";
import ResultPanel from "@/components/features/ResultPanel";
import { toast } from "sonner";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>(getHistory);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AnalysisResult | null>(null);

  const filtered = history.filter(
    (r) =>
      r.input.businessName.toLowerCase().includes(search.toLowerCase()) ||
      r.input.location?.toLowerCase().includes(search.toLowerCase()) ||
      CATEGORY_LABELS[r.input.category]?.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: string) {
    const updated = deleteFromHistory(id);
    setHistory(updated);
    if (selected?.id === id) setSelected(null);
    toast.success("Entry deleted");
  }

  function handleClearAll() {
    if (!window.confirm("Clear all analysis history?")) return;
    clearHistory();
    setHistory([]);
    setSelected(null);
    toast.success("History cleared");
  }

  if (history.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Clock size={40} className="text-slate-600 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-slate-300 mb-2">No history yet</h2>
        <p className="text-sm text-slate-500">
          Run your first analysis on the dashboard to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          <p className="text-sm text-slate-400 mt-1">
            {history.length} saved {history.length === 1 ? "analysis" : "analyses"}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="ghost-btn flex items-center gap-2 text-xs text-accent-red border-accent-red/30 hover:border-accent-red"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by business name, location, or category..."
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <Search size={24} className="text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No results for "{search}"</p>
            </div>
          ) : (
            filtered.map((item) => {
              const color = scoreToColor(item.confidence_score);
              const catLabel = CATEGORY_LABELS[item.input.category] ?? item.input.category;
              const isActive = selected?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`glass-panel p-4 cursor-pointer transition-all duration-200 group ${
                    isActive ? "border-brand/40 bg-brand/5" : "hover:border-surface-500"
                  }`}
                  onClick={() => setSelected(isActive ? null : item)}
                >
                  <div className="flex items-center gap-3">
                    {/* Score ring */}
                    <div
                      className="w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 mono text-xs font-bold"
                      style={{ borderColor: color, color }}
                    >
                      {item.confidence_score}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white">
                        {item.input.businessName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500 truncate">{catLabel}</span>
                        {item.input.location && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-xs text-slate-500 truncate">
                              {item.input.location}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{formatDate(item.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-1.5 rounded-md text-slate-600 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                      <ChevronRight
                        size={15}
                        className={`text-slate-600 transition-transform ${isActive ? "rotate-90 text-brand" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Problems preview */}
                  {item.problems.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-surface-600">
                      <AlertTriangle size={11} className="text-accent-red shrink-0" />
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.problems[0]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-24">
          {selected ? (
            <ResultPanel result={selected} />
          ) : (
            <div className="glass-panel p-10 text-center">
              <ChevronRight size={28} className="text-slate-600 mx-auto mb-3 rotate-90" />
              <p className="text-sm text-slate-400">Select an entry to view full analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
