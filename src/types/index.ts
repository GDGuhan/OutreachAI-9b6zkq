export type BusinessCategory =
  | "local_business"
  | "ecommerce"
  | "service_business"
  | "startup_saas"
  | "restaurant"
  | "healthcare"
  | "real_estate"
  | "other";

export type WebsiteStatus = "none" | "outdated" | "decent" | "good";

export interface AnalysisInput {
  businessName: string;
  websiteUrl: string;
  category: BusinessCategory;
  location: string;
  notes: string;
}

export interface AnalysisResult {
  id: string;
  input: AnalysisInput;
  analysis: string;
  problems: string[];
  suggestions: string[];
  outreach_message: string;
  confidence_score: number;
  websiteStatus: WebsiteStatus;
  createdAt: string;
}
