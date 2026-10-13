import { useEffect, useState } from "react";

const steps = [
  "Identifying online presence...",
  "Analyzing website status...",
  "Detecting pain points...",
  "Generating suggestions...",
  "Crafting outreach message...",
];

export default function ScanningState() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 flex flex-col items-center justify-center gap-6 min-h-[400px] animate-fade-in">
      {/* Scanner animation */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-brand/40 animate-pulse-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
          </div>
        </div>
        {/* Rotating ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: "2s" }}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#00D4AA"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="60 180"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Steps */}
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold text-white">Analyzing Business...</p>
        <div className="space-y-1">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-xs mono transition-all duration-300 ${
                i < stepIndex
                  ? "text-brand"
                  : i === stepIndex
                  ? "text-slate-300 animate-pulse"
                  : "text-slate-600"
              }`}
            >
              <span>{i < stepIndex ? "✓" : i === stepIndex ? "›" : "·"}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
