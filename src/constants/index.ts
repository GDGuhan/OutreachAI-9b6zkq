import type { BusinessCategory } from "@/types";

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  local_business: "Local Business",
  ecommerce: "E-commerce",
  service_business: "Service / Consultant",
  startup_saas: "Startup / SaaS",
  restaurant: "Restaurant / Food",
  healthcare: "Healthcare / Clinic",
  real_estate: "Real Estate",
  other: "Other",
};

export const CATEGORY_OPTIONS: { value: BusinessCategory; label: string }[] = [
  { value: "local_business", label: "Local Business (salon, gym, shop)" },
  { value: "restaurant", label: "Restaurant / Food & Beverage" },
  { value: "healthcare", label: "Healthcare / Clinic / Wellness" },
  { value: "real_estate", label: "Real Estate / Property" },
  { value: "ecommerce", label: "E-commerce / Online Store" },
  { value: "service_business", label: "Service / Consultant / Coach" },
  { value: "startup_saas", label: "Startup / SaaS / Tech" },
  { value: "other", label: "Other" },
];

export const HISTORY_KEY = "outreach_ai_history";
export const MAX_HISTORY = 50;
