import { useEffect, useRef, useState } from "react";
import { scoreToColor } from "@/lib/utils";

interface Props {
  score: number;
}

export default function ConfidenceBar({ score }: Props) {
  const [animated, setAnimated] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const color = scoreToColor(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const label =
    score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Outreach Confidence
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color }}>
            {label}
          </span>
          <span
            className="text-lg font-bold mono"
            style={{ color }}
          >
            {score}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full bg-surface-600 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${score}%` : "0%",
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
      <p className="text-[11px] text-slate-500">
        Score reflects website status, data completeness, and category opportunity.
      </p>
    </div>
  );
}
