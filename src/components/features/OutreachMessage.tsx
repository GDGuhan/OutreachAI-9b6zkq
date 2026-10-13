import { useState } from "react";
import { Copy, Check, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Props {
  message: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export default function OutreachMessage({ message, onRegenerate, regenerating }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const wordCount = message.trim().split(/\s+/).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-brand" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            Outreach Message
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 mono">{wordCount} words</span>
          {wordCount > 60 && (
            <span className="text-[10px] text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20 px-2 py-0.5 rounded-full">
              Over 60 words
            </span>
          )}
        </div>
      </div>

      <div className="glass-panel-inner p-4 relative group">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 ${
            copied
              ? "bg-brand/20 text-brand border border-brand/30"
              : "brand-btn"
          }`}
        >
          {copied ? (
            <>
              <Check size={15} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={15} />
              Copy Message
            </>
          )}
        </button>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="ghost-btn flex items-center gap-2 text-sm"
            title="Regenerate outreach message"
          >
            <RefreshCw size={15} className={regenerating ? "animate-spin" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}
