import type { AnalysisResult } from "@/types";
import { HISTORY_KEY, MAX_HISTORY } from "@/constants";

export function getHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as AnalysisResult[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(result: AnalysisResult): void {
  try {
    const existing = getHistory();
    const updated = [result, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    console.warn("Could not save to history");
  }
}

export function deleteFromHistory(id: string): AnalysisResult[] {
  const existing = getHistory().filter((r) => r.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(existing));
  return existing;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
