import { AlertTriangle, Lightbulb, Globe, Tag, Download } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { CATEGORY_LABELS } from "@/constants";
import { formatDate } from "@/lib/utils";
import ConfidenceBar from "@/components/features/ConfidenceBar";
import OutreachMessage from "@/components/features/OutreachMessage";
import { toast } from "sonner";

interface Props {
  result: AnalysisResult;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  none: { label: "No Website", color: "#FF4D6A", bg: "rgba(255,77,106,0.1)" },
  outdated: { label: "Outdated Site", color: "#FFB547", bg: "rgba(255,181,71,0.1)" },
  decent: { label: "Basic Site", color: "#4D9FFF", bg: "rgba(77,159,255,0.1)" },
  good: { label: "Good Site", color: "#00D4AA", bg: "rgba(0,212,170,0.1)" },
};

export default function ResultPanel({ result }: Props) {
  const status = STATUS_LABELS[result.websiteStatus] ?? STATUS_LABELS.decent;
  const catLabel = CATEGORY_LABELS[result.input.category] ?? result.input.category;

  function handleExport() {
    const data = {
      analysis: result.analysis,
      problems: result.problems,
      suggestions: result.suggestions,
      outreach_message: result.outreach_message,
      confidence_score: `${result.confidence_score}%`,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-${result.input.businessName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON exported!");
  }

  return (
    <div className="glass-panel p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-surface-600">
        <div>
          <h2 className="text-lg font-bold text-white">{result.input.businessName}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 font-medium">
              {catLabel}
            </span>
            {result.input.location && (
              <span className="text-xs text-slate-500">{result.input.location}</span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium border"
              style={{
                color: status.color,
                backgroundColor: status.bg,
                borderColor: `${status.color}30`,
              }}
            >
              {status.label}
            </span>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="ghost-btn flex items-center gap-1.5 text-xs whitespace-nowrap"
          title="Export JSON"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export JSON</span>
        </button>
      </div>

      {/* Website Status */}
      {result.input.websiteUrl && (
        <div className="flex items-center gap-2 glass-panel-inner px-3 py-2">
          <Globe size={13} className="text-slate-500 shrink-0" />
          <span className="text-xs text-slate-400 truncate mono">{result.input.websiteUrl}</span>
        </div>
      )}

      {/* Analysis */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="glow-dot" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mono">
            Analysis
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{result.analysis}</p>
      </div>

      {/* Confidence */}
      <div className="glass-panel-inner p-4">
        <ConfidenceBar score={result.confidence_score} />
      </div>

      {/* Problems */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-accent-red" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Problems Identified
          </span>
          <span className="ml-auto text-xs text-slate-600 mono">{result.problems.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.problems.map((p, i) => (
            <span key={i} className="tag-problem">
              <AlertTriangle size={10} />
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={14} className="text-brand" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Suggestions
          </span>
          <span className="ml-auto text-xs text-slate-600 mono">{result.suggestions.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.suggestions.map((s, i) => (
            <span key={i} className="tag-suggestion">
              <Lightbulb size={10} />
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Outreach Message */}
      <div className="glass-panel-inner p-4">
        <OutreachMessage message={result.outreach_message} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-600">
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <Tag size={11} />
          <span className="mono">{result.id}</span>
        </div>
        <span className="text-[11px] text-slate-600">{formatDate(result.createdAt)}</span>
      </div>
    </div>
  );
}
