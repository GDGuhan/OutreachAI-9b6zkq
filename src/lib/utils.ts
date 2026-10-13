import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

// ─── Paste-mode template parser ─────────────────────────────────────────────
// Accepts the template format:
//   Business Name: Acme Corp
//   Business Type: gym
//   Location: Austin, TX
//   Website: https://... or none
//   Instagram: https://... or none
// Any line with an unfilled {{placeholder}} value is treated as empty.

import type { AnalysisInput, BusinessCategory } from "@/types";

const CATEGORY_MAP: Record<string, BusinessCategory> = {
  gym: "local_business",
  salon: "local_business",
  barbershop: "local_business",
  barber: "local_business",
  shop: "local_business",
  store: "local_business",
  local: "local_business",
  local_business: "local_business",
  restaurant: "restaurant",
  cafe: "restaurant",
  coffee: "restaurant",
  food: "restaurant",
  bar: "restaurant",
  bakery: "restaurant",
  clinic: "healthcare",
  healthcare: "healthcare",
  dentist: "healthcare",
  doctor: "healthcare",
  wellness: "healthcare",
  spa: "healthcare",
  physio: "healthcare",
  real_estate: "real_estate",
  realtor: "real_estate",
  property: "real_estate",
  agency: "real_estate",
  ecommerce: "ecommerce",
  "e-commerce": "ecommerce",
  online_store: "ecommerce",
  shop_online: "ecommerce",
  consultant: "service_business",
  consulting: "service_business",
  freelancer: "service_business",
  coach: "service_business",
  service: "service_business",
  service_business: "service_business",
  startup: "startup_saas",
  saas: "startup_saas",
  startup_saas: "startup_saas",
  tech: "startup_saas",
  app: "startup_saas",
};

function isPlaceholder(val: string): boolean {
  return /\{\{.*?\}\}/.test(val.trim());
}

function extractValue(line: string): string {
  const idx = line.indexOf(":");
  if (idx === -1) return "";
  const val = line.slice(idx + 1).trim();
  if (isPlaceholder(val)) return "";
  if (/^none$/i.test(val)) return "";
  return val;
}

export function parsePasteInput(raw: string): Partial<AnalysisInput> {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<AnalysisInput> = {};

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith("business name")) {
      const v = extractValue(line);
      if (v) result.businessName = v;
    } else if (lower.startsWith("business type") || lower.startsWith("type")) {
      const v = extractValue(line).toLowerCase().replace(/[\s/]+/g, "_");
      const mapped = CATEGORY_MAP[v];
      if (mapped) result.category = mapped;
      // try partial match
      if (!mapped) {
        for (const key of Object.keys(CATEGORY_MAP)) {
          if (v.includes(key) || key.includes(v)) {
            result.category = CATEGORY_MAP[key];
            break;
          }
        }
      }
    } else if (lower.startsWith("location") || lower.startsWith("city")) {
      const v = extractValue(line);
      if (v) result.location = v;
    } else if (lower.startsWith("website") || lower.startsWith("url") || lower.startsWith("site")) {
      const v = extractValue(line);
      if (v) result.websiteUrl = v;
    } else if (lower.startsWith("instagram") || lower.startsWith("social")) {
      const v = extractValue(line);
      if (v) {
        // append instagram info to notes
        result.notes = result.notes
          ? result.notes + " Instagram: " + v
          : "Instagram: " + v;
      }
    } else if (lower.startsWith("note") || lower.startsWith("info") || lower.startsWith("additional")) {
      const v = extractValue(line);
      if (v) result.notes = v;
    }
  }

  return result;
}

export function scoreToColor(score: number): string {
  if (score >= 75) return "#00D4AA";
  if (score >= 50) return "#FFB547";
  return "#FF4D6A";
}
