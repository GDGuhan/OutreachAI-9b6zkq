import { useState } from "react";
import {
  Globe,
  Building2,
  MapPin,
  FileText,
  Zap,
  Loader2,
  ClipboardPaste,
  FormInput,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { AnalysisInput, BusinessCategory } from "@/types";
import { CATEGORY_OPTIONS } from "@/constants";
import { cn, parsePasteInput } from "@/lib/utils";

interface Props {
  onSubmit: (input: AnalysisInput) => void;
  loading: boolean;
}

const defaultInput: AnalysisInput = {
  businessName: "",
  websiteUrl: "",
  category: "local_business",
  location: "",
  notes: "",
};

const PASTE_TEMPLATE = `Business Name: 
Business Type: 
Location: 
Website: 
Instagram: `;

type Mode = "form" | "paste";
type ParseStatus = "idle" | "ok" | "partial" | "error";

export default function AnalysisForm({ onSubmit, loading }: Props) {
  const [mode, setMode] = useState<Mode>("form");
  const [input, setInput] = useState<AnalysisInput>(defaultInput);
  const [errors, setErrors] = useState<Partial<Record<keyof AnalysisInput, string>>>({});

  // Paste mode state
  const [pasteText, setPasteText] = useState("");
  const [parseStatus, setParseStatus] = useState<ParseStatus>("idle");
  const [parsedFields, setParsedFields] = useState<string[]>([]);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {};
    if (!input.businessName.trim()) e.businessName = "Business name is required";
    if (!input.category) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(input);
  }

  function field(key: keyof AnalysisInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Paste Mode ──────────────────────────────────────────────────────────────
  function handlePasteChange(text: string) {
    setPasteText(text);
    if (!text.trim()) {
      setParseStatus("idle");
      setParsedFields([]);
      return;
    }

    const parsed = parsePasteInput(text);
    const found: string[] = [];
    if (parsed.businessName) found.push("Business Name");
    if (parsed.category) found.push("Type");
    if (parsed.location) found.push("Location");
    if (parsed.websiteUrl) found.push("Website");
    if (parsed.notes) found.push("Extra info");

    setParsedFields(found);

    if (!parsed.businessName) {
      setParseStatus(found.length > 0 ? "partial" : "error");
    } else {
      setParseStatus(found.length >= 2 ? "ok" : "partial");
    }

    // Merge parsed into input (keep defaults for missing fields)
    setInput({
      businessName: parsed.businessName ?? "",
      category: parsed.category ?? "local_business",
      location: parsed.location ?? "",
      websiteUrl: parsed.websiteUrl ?? "",
      notes: parsed.notes ?? "",
    });
  }

  function handlePasteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.businessName.trim()) return;
    onSubmit(input);
  }

  function handlePasteFromClipboard() {
    navigator.clipboard.readText().then((text) => {
      handlePasteChange(text);
    });
  }

  // ── Mode switch ─────────────────────────────────────────────────────────────
  function switchMode(m: Mode) {
    setMode(m);
    setErrors({});
    setParseStatus("idle");
    setParsedFields([]);
    if (m === "form") {
      // keep whatever was parsed
    } else {
      // reset paste text when switching to paste
      setPasteText("");
      setInput(defaultInput);
    }
  }

  const statusIcon = {
    idle: null,
    ok: <CheckCircle2 size={13} className="text-brand" />,
    partial: <AlertCircle size={13} className="text-accent-yellow" />,
    error: <AlertCircle size={13} className="text-accent-red" />,
  };

  const statusText = {
    idle: "",
    ok: `Detected: ${parsedFields.join(", ")}`,
    partial: parsedFields.length
      ? `Partial — found: ${parsedFields.join(", ")}. Business name required.`
      : "Couldn't parse. Try filling in the fields below.",
    error: "Couldn't detect fields. Fill in the form manually.",
  };

  const canSubmitPaste = parseStatus === "ok" || parseStatus === "partial" && !!input.businessName;

  return (
    <div className="glass-panel p-6 space-y-5">
      {/* Header + Mode Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-600">
        <div className="flex items-center gap-2">
          <div className="glow-dot" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mono">
            Business Intel
          </span>
        </div>
        {/* Mode tabs */}
        <div className="flex items-center gap-1 bg-surface-700 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => switchMode("form")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "form"
                ? "bg-brand/15 text-brand"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <FormInput size={12} />
            Form
          </button>
          <button
            type="button"
            onClick={() => switchMode("paste")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              mode === "paste"
                ? "bg-brand/15 text-brand"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ClipboardPaste size={12} />
            Paste
          </button>
        </div>
      </div>

      {/* ── PASTE MODE ── */}
      {mode === "paste" && (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Paste business info
              </label>
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="ghost-btn flex items-center gap-1 text-[11px]"
              >
                <ClipboardPaste size={11} />
                From clipboard
              </button>
            </div>
            <textarea
              placeholder={PASTE_TEMPLATE}
              className="input-field resize-none font-mono text-xs leading-relaxed"
              rows={6}
              value={pasteText}
              onChange={(e) => handlePasteChange(e.target.value)}
              disabled={loading}
            />
            {/* Parse status */}
            {parseStatus !== "idle" && (
              <div
                className={cn(
                  "flex items-start gap-2 text-[11px] leading-snug px-3 py-2 rounded-lg border",
                  parseStatus === "ok" && "bg-brand/5 border-brand/20 text-brand",
                  parseStatus === "partial" && "bg-accent-yellow/5 border-accent-yellow/20 text-accent-yellow",
                  parseStatus === "error" && "bg-accent-red/5 border-accent-red/20 text-accent-red"
                )}
              >
                {statusIcon[parseStatus]}
                <span>{statusText[parseStatus]}</span>
              </div>
            )}
          </div>

          {/* Show parsed fields summary or editable fallback */}
          {(parseStatus === "ok" || parseStatus === "partial") && (
            <div className="glass-panel-inner p-3 space-y-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">Parsed preview</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className={cn(input.businessName ? "text-slate-200" : "text-slate-600 italic")}>
                    {input.businessName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Type:</span>{" "}
                  <span className="text-slate-200">{input.category.replace(/_/g, " ")}</span>
                </div>
                <div>
                  <span className="text-slate-500">Location:</span>{" "}
                  <span className={cn(input.location ? "text-slate-200" : "text-slate-600 italic")}>
                    {input.location || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Website:</span>{" "}
                  <span className={cn(input.websiteUrl ? "text-slate-200 truncate" : "text-slate-600 italic")}>
                    {input.websiteUrl || "none"}
                  </span>
                </div>
              </div>
              {/* Quick-fix: business name if missing */}
              {!input.businessName && (
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-accent-red">Business name is required to continue:</p>
                  <input
                    type="text"
                    placeholder="Enter business name"
                    className="input-field text-sm"
                    value={input.businessName}
                    onChange={(e) => setInput((p) => ({ ...p, businessName: e.target.value }))}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmitPaste}
            className="brand-btn w-full flex items-center justify-center gap-2 text-sm disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing business...
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Analysis
              </>
            )}
          </button>
        </form>
      )}

      {/* ── FORM MODE ── */}
      {mode === "form" && (
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <Building2 size={12} />
              Business Name <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mike's Auto Repair"
              className={cn("input-field", errors.businessName && "border-accent-red focus:border-accent-red focus:ring-accent-red")}
              value={input.businessName}
              onChange={(e) => field("businessName", e.target.value)}
              disabled={loading}
            />
            {errors.businessName && (
              <p className="text-xs text-accent-red">{errors.businessName}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <Zap size={12} />
              Business Type <span className="text-accent-red">*</span>
            </label>
            <select
              className={cn("input-field appearance-none cursor-pointer", errors.category && "border-accent-red")}
              value={input.category}
              onChange={(e) => field("category", e.target.value as BusinessCategory)}
              disabled={loading}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface-800">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-accent-red">{errors.category}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <Globe size={12} />
              Website URL
              <span className="ml-auto text-[10px] font-normal text-slate-500 normal-case tracking-normal">
                Leave blank if none
              </span>
            </label>
            <input
              type="text"
              placeholder="https://example.com (or leave blank)"
              className="input-field"
              value={input.websiteUrl}
              onChange={(e) => field("websiteUrl", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <MapPin size={12} />
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Austin, TX"
              className="input-field"
              value={input.location}
              onChange={(e) => field("location", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <FileText size={12} />
              Additional Notes
              <span className="ml-auto text-[10px] font-normal text-slate-500 normal-case tracking-normal">
                Personalize further
              </span>
            </label>
            <textarea
              placeholder="e.g. Active on Instagram, 50+ Google reviews, wants more online orders..."
              className="input-field resize-none"
              rows={3}
              value={input.notes}
              onChange={(e) => field("notes", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="brand-btn w-full flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing business...
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Analysis
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
