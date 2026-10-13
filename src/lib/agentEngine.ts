import type { AnalysisInput, AnalysisResult, WebsiteStatus } from "@/types";
import { generateId } from "@/lib/utils";

// ─── Heuristics ───────────────────────────────────────────────────────────────

function detectWebsiteStatus(url: string): WebsiteStatus {
  if (!url || url.trim() === "") return "none";
  const lower = url.toLowerCase();
  if (
    lower.includes("wix.com") ||
    lower.includes("weebly.com") ||
    lower.includes("yolasite.com") ||
    lower.includes("angelfire") ||
    lower.includes("tripod")
  )
    return "outdated";
  if (lower.includes("facebook.com") || lower.includes("instagram.com"))
    return "outdated"; // social-only "website"
  return "decent"; // default assumption for unknown URLs
}

function calcConfidence(
  input: AnalysisInput,
  status: WebsiteStatus
): number {
  let score = 50;
  if (input.businessName.length > 3) score += 10;
  if (input.location) score += 10;
  if (input.notes && input.notes.length > 10) score += 15;
  if (status === "none") score += 5; // clear problem = high confidence in pitch
  if (status === "outdated") score += 10;
  if (status === "decent") score -= 5;
  if (status === "good") score -= 10;
  return Math.min(Math.max(score, 30), 95);
}

// ─── Analysis Templates ────────────────────────────────────────────────────────

interface Template {
  analysis: (input: AnalysisInput) => string;
  problems: {
    none: string[];
    outdated: string[];
    decent: string[];
    good: string[];
  };
  suggestions: {
    none: string[];
    outdated: string[];
    decent: string[];
    good: string[];
  };
  outreach: {
    none: (input: AnalysisInput) => string;
    outdated: (input: AnalysisInput) => string;
    decent: (input: AnalysisInput) => string;
    good: (input: AnalysisInput) => string;
  };
}

const templates: Record<string, Template> = {
  restaurant: {
    analysis: (i) =>
      `${i.businessName} is a restaurant/food business${i.location ? ` in ${i.location}` : ""}. In this space, an optimized online presence directly drives reservations, delivery orders, and foot traffic. Customers search on Google Maps, Yelp, and Instagram before deciding where to eat.`,
    problems: {
      none: [
        "No website means missing Google organic search traffic",
        "Can't take online reservations or show the menu digitally",
        "Customers who search 'restaurants near me' won't find you",
        "No way to build email/SMS list for repeat customers",
      ],
      outdated: [
        "Slow or non-mobile-friendly site hurts Google ranking",
        "No online ordering system means losing delivery revenue",
        "Missing schema markup (hours, location, menu) in search results",
        "Outdated visuals undermine food quality perception",
      ],
      decent: [
        "No clear call-to-action for reservations or ordering",
        "Google Business Profile likely not fully optimized",
        "Menu isn't SEO-friendly (probably a PDF, not HTML)",
      ],
      good: [
        "Could improve page speed score for better Google ranking",
        "Not capturing email leads for promotions and events",
        "Missing structured data for rich snippets in search",
      ],
    },
    suggestions: {
      none: [
        "Build a simple 3-page site: Home, Menu, Contact",
        "Set up Google Business Profile with photos and hours",
        "Add online reservation widget (OpenTable or Resy embed)",
        "Create Instagram-linked photo gallery on the site",
      ],
      outdated: [
        "Rebuild with mobile-first responsive design",
        "Add online ordering integration (Toast or Square)",
        "Optimize Google Business Profile — photos, posts, reviews",
        "Fix page speed: compress images, enable caching",
      ],
      decent: [
        "Add a sticky 'Book a Table' CTA on every page",
        "Create a blog for local SEO (events, specials, recipes)",
        "Integrate review widget to showcase Google/Yelp stars",
      ],
      good: [
        "A/B test landing page CTAs for reservations vs delivery",
        "Add email capture with a special offer (e.g., 10% off)",
        "Launch a loyalty program landing page",
      ],
    },
    outreach: {
      none: (i) =>
        `Hey! I was looking up ${i.businessName}${i.location ? ` in ${i.location}` : ""} and couldn't find a website. I build simple sites for restaurants that pull in reservations and show up on Google. Quick question — is that something you'd want?`,
      outdated: (i) =>
        `Hi! Found ${i.businessName} online — your site's there but it doesn't load great on mobile. Most people search on their phone now, so it's probably costing you customers. I can fix that fast. Want me to show you what I'd change?`,
      decent: (i) =>
        `Hey! Checked out ${i.businessName}'s site — looks decent but I noticed a few things that could bring in more reservations from Google. I do this for restaurants a lot. Would a quick Loom walkthrough be helpful?`,
      good: (i) =>
        `Hey! I was looking at ${i.businessName}'s site and it's solid. Noticed a couple of quick wins for local SEO that could push you higher in search results. Happy to share them — no strings attached. Interested?`,
    },
  },

  local_business: {
    analysis: (i) =>
      `${i.businessName} is a local business${i.location ? ` in ${i.location}` : ""}. Local businesses live and die by their Google presence. People searching "near me" queries convert at 28% — the highest of any search intent. An optimized web presence is the single biggest growth lever.`,
    problems: {
      none: [
        "Invisible to 'near me' Google searches — biggest missed opportunity",
        "No way to collect reviews or showcase social proof",
        "Competitors with websites are capturing all organic search traffic",
        "No online booking or contact form loses warm leads",
      ],
      outdated: [
        "Mobile usability issues directly hurt Google local ranking",
        "Slow load time increases bounce rate and kills conversions",
        "Missing NAP consistency (Name, Address, Phone) across the web",
        "No clear service pages for local keyword targeting",
      ],
      decent: [
        "Google Business Profile may not be fully claimed and optimized",
        "No review collection strategy to build social proof",
        "Missing local schema markup for better search visibility",
      ],
      good: [
        "Could be ranking higher with proper local citation building",
        "No content marketing to attract organic local traffic",
        "Lead capture (email/SMS) not being used to retain customers",
      ],
    },
    suggestions: {
      none: [
        "Build a 4-page local site: Home, Services, About, Contact",
        "Claim and fully optimize Google Business Profile",
        "Add click-to-call and directions button prominently",
        "Embed Google reviews widget for instant social proof",
      ],
      outdated: [
        "Modernize with a responsive, fast-loading redesign",
        "Add dedicated pages for each service (great for local SEO)",
        "Implement click-to-call and online booking form",
        "Fix Core Web Vitals to improve Google ranking",
      ],
      decent: [
        "Create location-specific landing pages for nearby cities",
        "Launch a review collection automation via SMS/email",
        "Add FAQ schema markup to appear in Google featured snippets",
      ],
      good: [
        "Expand to nearby city pages for more local SEO coverage",
        "Start a monthly Google Business Profile posting routine",
        "Add live chat widget to capture after-hours leads",
      ],
    },
    outreach: {
      none: (i) =>
        `Hi! I searched for ${i.businessName}${i.location ? ` in ${i.location}` : ""} and couldn't find a website. Without one, you're invisible on Google. I build sites for local businesses that actually bring in calls and leads. Worth a quick chat?`,
      outdated: (i) =>
        `Hey! I came across ${i.businessName} — your site is there but it's not mobile-friendly, which is hurting your Google ranking. I help local businesses fix this fast. Want me to send over a free audit?`,
      decent: (i) =>
        `Hi! Looked at ${i.businessName}'s website — it's good but I spotted some quick wins for local search that your competitors might already be using. I help businesses like yours rank higher. Wanna take a look?`,
      good: (i) =>
        `Hey! Checked out ${i.businessName} — solid site. Noticed you could rank even higher with a couple of local SEO tweaks. I can walk you through them for free. Interested?`,
    },
  },

  service_business: {
    analysis: (i) =>
      `${i.businessName} is a service or consulting business${i.location ? ` in ${i.location}` : ""}. For service providers, a website is a trust engine — it's where prospects evaluate expertise before making contact. Conversion-focused design, clear positioning, and SEO are critical growth levers.`,
    problems: {
      none: [
        "No web presence = zero credibility for high-ticket clients",
        "Relying 100% on referrals limits growth ceiling",
        "No way to showcase past work, testimonials, or case studies",
        "Missing inbound lead funnel — every lead must be chased",
      ],
      outdated: [
        "Dated design signals low professionalism to potential clients",
        "No clear value proposition above the fold",
        "Missing social proof (reviews, case studies, logos)",
        "No lead magnet or contact form to capture interested visitors",
      ],
      decent: [
        "No clear primary CTA (book a call, get a quote)",
        "Blog or content not being used to demonstrate expertise",
        "LinkedIn/social proof not connected to website",
      ],
      good: [
        "Could convert more visitors with a lead magnet (free audit, guide)",
        "Testimonials exist but not prominently featured",
        "SEO content strategy missing for inbound lead generation",
      ],
    },
    suggestions: {
      none: [
        "Build a professional 5-page site with strong positioning",
        "Add a clear 'Book a Free Call' CTA on every page",
        "Create a services page with pricing tiers or packages",
        "Add testimonials and case studies to build trust fast",
      ],
      outdated: [
        "Redesign with a clean, modern layout focused on conversions",
        "Add a 'Results' or 'Case Studies' page with real metrics",
        "Implement Calendly embed for frictionless consultation booking",
        "Write service-specific pages targeting search keywords",
      ],
      decent: [
        "Make the primary CTA ('Book a Call') visible on every scroll",
        "Add a simple lead magnet (free checklist, audit, or template)",
        "Start publishing one helpful article per month for SEO",
      ],
      good: [
        "Build an email nurture sequence for leads who don't book immediately",
        "Create a resources/tools page to attract organic traffic",
        "Add a 'Featured In' or press section if applicable",
      ],
    },
    outreach: {
      none: (i) =>
        `Hi! I noticed ${i.businessName} doesn't have a website yet. For consultants, that's a huge missed opportunity — clients Google you before they call. I build conversion-focused sites for service businesses. Quick chat?`,
      outdated: (i) =>
        `Hey! Found ${i.businessName} online — your site is up but it doesn't really sell your services. First impressions matter a lot for consulting. I help service businesses fix this. Want to see what I'd improve?`,
      decent: (i) =>
        `Hi! Checked out ${i.businessName}'s site — nice work. But I noticed you're not capturing leads from visitors who aren't ready to book. Easy fix. I do this for consultants often. Want a 5-min rundown?`,
      good: (i) =>
        `Hey! ${i.businessName}'s site looks great. One thing — you're probably leaving inbound leads on the table without a content strategy. I can show you what's working. Free to chat?`,
    },
  },

  ecommerce: {
    analysis: (i) =>
      `${i.businessName} is an e-commerce business${i.location ? ` in ${i.location}` : ""}. In online retail, conversion rate and page speed are everything. A 1-second delay in load time reduces conversions by 7%. The biggest growth levers are: site performance, SEO product pages, cart abandonment recovery, and trust signals.`,
    problems: {
      none: [
        "No website means zero online sales channel",
        "Missing out on $4.9T+ global e-commerce market",
        "No way to rank products on Google Shopping",
        "Can't build customer email list for repeat purchases",
      ],
      outdated: [
        "Slow site speed is costing you conversions (7% lost per second)",
        "Non-mobile checkout experience leads to abandoned carts",
        "Missing trust signals (SSL, reviews, return policy)",
        "No product schema markup means missing Google Shopping listings",
      ],
      decent: [
        "Cart abandonment emails not set up (avg 15% recovery rate)",
        "Product pages lack SEO-optimized descriptions",
        "No upsell or cross-sell logic on product/cart pages",
      ],
      good: [
        "Could improve product page conversion with better photography",
        "Not leveraging Google Shopping or Meta retargeting fully",
        "Subscription or loyalty program could boost LTV",
      ],
    },
    suggestions: {
      none: [
        "Launch on Shopify with a clean, conversion-focused theme",
        "Set up Google Shopping and Meta Pixel from day one",
        "Add trust badges: secure checkout, free returns, reviews",
        "Build a simple email capture with a first-order discount",
      ],
      outdated: [
        "Migrate to a modern, fast platform (Shopify, WooCommerce)",
        "Implement abandoned cart email sequence",
        "Add product reviews widget (Judge.me or Loox)",
        "Fix mobile checkout flow — reduce steps to purchase",
      ],
      decent: [
        "Set up Klaviyo flows: welcome series, abandoned cart, win-back",
        "Add product page SEO: H1 with keywords, alt text, descriptions",
        "Implement upsell app on product and cart pages",
      ],
      good: [
        "Launch a loyalty/rewards program to increase repeat purchase rate",
        "Add a blog for long-tail SEO and organic product discovery",
        "Test subscription offering for consumable products",
      ],
    },
    outreach: {
      none: (i) =>
        `Hey! I looked up ${i.businessName} and couldn't find an online store. You're leaving real money on the table — e-comm is easier to start than most think. I build stores that actually sell. Want to talk?`,
      outdated: (i) =>
        `Hi! Found ${i.businessName}'s store — looks like it needs some love. Slow or outdated stores lose customers before checkout. I help online brands fix this. Want a free speed + conversion audit?`,
      decent: (i) =>
        `Hey! Checked out ${i.businessName} — solid store. Noticed you don't have abandoned cart emails set up though — that's usually 10-15% extra revenue for free. I help with stuff like this. Interested?`,
      good: (i) =>
        `Hey! ${i.businessName}'s store looks really good. One thing I'd look at — your product page SEO could bring in a lot more organic traffic. Happy to share what I see. Want me to?`,
    },
  },

  startup_saas: {
    analysis: (i) =>
      `${i.businessName} is a startup or SaaS product${i.location ? ` in ${i.location}` : ""}. For SaaS, the website is the primary sales rep. Clear value proposition, frictionless trial signup, and SEO content are the main growth drivers. Landing page conversion rate is the single most important metric to optimize.`,
    problems: {
      none: [
        "No web presence = no credibility with B2B buyers or investors",
        "Can't capture trial signups or demo requests without a site",
        "Missing SEO foundation for product-led growth",
        "Competitors ranking for your target keywords while you're absent",
      ],
      outdated: [
        "Outdated design signals product quality issues to prospects",
        "Missing clear value proposition above the fold",
        "No social proof (user count, logos, testimonials, G2 reviews)",
        "Signup/demo CTA not optimized for conversion",
      ],
      decent: [
        "Pricing page may not be converting — common optimization opportunity",
        "No SEO blog to capture top-of-funnel traffic",
        "Missing comparison pages vs competitors (high-intent keywords)",
      ],
      good: [
        "Could improve trial-to-paid conversion with better onboarding flow",
        "Integration/use-case pages missing for niche SEO traffic",
        "No case study or ROI calculator to help enterprise buyers justify purchase",
      ],
    },
    suggestions: {
      none: [
        "Build a focused landing page with clear value prop and CTA",
        "Add social proof early: beta users, early customers, press mentions",
        "Set up product analytics (Mixpanel, PostHog) from launch",
        "Create a simple pricing page with 3 tiers",
      ],
      outdated: [
        "Redesign homepage with a clear above-the-fold CTA",
        "Add customer logos, testimonials, and usage metrics",
        "Build a comparison page vs your top 2 competitors",
        "Improve pricing page clarity — add feature comparison table",
      ],
      decent: [
        "Start a content/SEO strategy targeting problem-aware keywords",
        "Add an ROI calculator or interactive demo to the site",
        "Create integration pages for each tool you connect with",
      ],
      good: [
        "Build a resource hub (templates, guides) for organic traffic",
        "Add a case study with specific metrics for enterprise outreach",
        "Test homepage headline variants with A/B testing",
      ],
    },
    outreach: {
      none: (i) =>
        `Hey! I was looking for ${i.businessName} online and couldn't find a site. For SaaS, that's a credibility killer. I build conversion-focused landing pages for early-stage products. Happy to share some ideas if you're interested?`,
      outdated: (i) =>
        `Hi! Found ${i.businessName}'s site — the product sounds interesting but the site doesn't sell it well. First impressions really matter for SaaS signups. I help startups fix this. Want to see what I'd change?`,
      decent: (i) =>
        `Hey! Checked out ${i.businessName} — solid product page. One thing — no comparison pages against competitors means you're missing high-intent traffic. I build these for SaaS companies. Quick call?`,
      good: (i) =>
        `Hey! ${i.businessName}'s site looks clean. Noticed you don't have a content/SEO strategy running yet — that's usually the biggest long-term growth lever for SaaS. Happy to share what's working. Interested?`,
    },
  },

  healthcare: {
    analysis: (i) =>
      `${i.businessName} is a healthcare or wellness business${i.location ? ` in ${i.location}` : ""}. Patients research providers thoroughly before booking. Trust signals, clear service descriptions, easy online booking, and local SEO are the most critical web presence factors in this industry.`,
    problems: {
      none: [
        "Patients can't find you when searching for providers nearby",
        "No way to show credentials, specializations, or patient reviews",
        "Missing online booking means friction for new patient acquisition",
        "HIPAA-compliant contact forms needed — can't rely on generic email",
      ],
      outdated: [
        "Outdated design reduces perceived professionalism and trust",
        "Not mobile-friendly — most patients search on phones",
        "Missing online appointment booking integration",
        "No patient reviews or testimonials visible online",
      ],
      decent: [
        "Google Business Profile may not be fully optimized",
        "No patient education content for organic search traffic",
        "Online booking not integrated directly on the website",
      ],
      good: [
        "Could rank higher with dedicated condition/treatment pages",
        "Patient portal or FAQ section missing for common questions",
        "Review generation strategy could boost Google rating",
      ],
    },
    suggestions: {
      none: [
        "Build a professional 5-page healthcare site",
        "Integrate online booking (Zocdoc embed or Calendly)",
        "Add credentials, specializations, and staff bios",
        "Set up Google Business Profile with correct category and hours",
      ],
      outdated: [
        "Redesign with a clean, HIPAA-conscious modern layout",
        "Add online appointment booking on every page",
        "Create dedicated pages per service or specialty for local SEO",
        "Add patient testimonials and star rating prominently",
      ],
      decent: [
        "Create condition-specific landing pages for local keyword targeting",
        "Add FAQ schema markup to appear in Google's 'People Also Ask'",
        "Automate review requests post-appointment via email/SMS",
      ],
      good: [
        "Build a patient education blog for organic search traffic",
        "Add virtual consultation option as a new service line",
        "Create a new patient checklist page to reduce front-desk calls",
      ],
    },
    outreach: {
      none: (i) =>
        `Hi! I searched for ${i.businessName}${i.location ? ` in ${i.location}` : ""} and couldn't find a website. Most patients Google their provider first — without a site, you're losing new bookings. I build healthcare sites that fix this. Worth a quick chat?`,
      outdated: (i) =>
        `Hey! Found ${i.businessName} online — your site's there but it's not mobile-friendly and doesn't have online booking. Patients expect both now. I help clinics modernize quickly. Want to see what I'd do?`,
      decent: (i) =>
        `Hi! Checked out ${i.businessName}'s site — nice. One thing I noticed — no online booking directly on the site. That's probably costing you new patients. Easy to add. Want me to show you how?`,
      good: (i) =>
        `Hey! ${i.businessName}'s site looks solid. I noticed you could rank higher for local health searches with some condition-specific pages. I do this for clinics — happy to share specifics for free.`,
    },
  },

  real_estate: {
    analysis: (i) =>
      `${i.businessName} is a real estate business${i.location ? ` in ${i.location}` : ""}. Real estate buyers and sellers start online — 97% use the internet during their search. A professional web presence with IDX listings, lead capture, and local SEO is the foundation of a modern real estate growth strategy.`,
    problems: {
      none: [
        "97% of buyers start online — you're invisible to them",
        "No way to showcase listings, testimonials, or sold properties",
        "Competitors with sites are capturing all organic real estate searches",
        "No lead magnet to capture buyer/seller contact information",
      ],
      outdated: [
        "Outdated site signals lack of professionalism in high-trust industry",
        "No IDX listing integration — buyers go to Zillow instead",
        "Not showing sold properties or success metrics",
        "Mobile experience is poor for on-the-go property searches",
      ],
      decent: [
        "No lead magnet (home valuation tool, market report) for seller leads",
        "Missing neighborhood guides for local SEO",
        "No clear differentiation from other local agents",
      ],
      good: [
        "Could add home valuation landing page for seller lead generation",
        "Neighborhood guide content missing for organic traffic",
        "Client video testimonials could boost trust significantly",
      ],
    },
    suggestions: {
      none: [
        "Build a professional real estate site with IDX listings",
        "Add home valuation CTA to capture seller leads",
        "Create an agent bio page with credentials and past sales",
        "Set up Google Business Profile with real estate category",
      ],
      outdated: [
        "Redesign with modern, mobile-first real estate layout",
        "Integrate IDX or MLS feed for live listings",
        "Add sold properties gallery with price and timeline",
        "Implement lead capture with instant home valuation offer",
      ],
      decent: [
        "Launch neighborhood guide pages for local keyword targeting",
        "Add home valuation landing page (HomeBot or similar)",
        "Create a 'Why Work With Me' page with differentiators and stats",
      ],
      good: [
        "Build a hyper-local blog covering market trends by neighborhood",
        "Add video walk-through embeds on listing pages",
        "Launch a seller email sequence triggered by valuation request",
      ],
    },
    outreach: {
      none: (i) =>
        `Hi! I was looking up ${i.businessName}${i.location ? ` in ${i.location}` : ""} and couldn't find a website. In real estate, that's a big deal — buyers and sellers Google agents before they call. I build sites for agents. Worth a quick chat?`,
      outdated: (i) =>
        `Hey! Found ${i.businessName} online — your site is there but it's not pulling in leads the way it should. I help real estate agents modernize their sites and start getting inbound inquiries. Want me to send a quick audit?`,
      decent: (i) =>
        `Hi! Checked out ${i.businessName}'s site — nice work. Noticed you're not capturing seller leads though. A home valuation tool is one of the best ways to do that. I set these up for agents. Interested?`,
      good: (i) =>
        `Hey! ${i.businessName}'s site looks great. One thing — neighborhood guide pages could bring in a lot more organic buyer traffic from Google. I build these for agents. Happy to show you an example?`,
    },
  },

  other: {
    analysis: (i) =>
      `${i.businessName} is a business${i.location ? ` in ${i.location}` : ""} with an online presence opportunity. A professional website is the cornerstone of digital credibility, customer discovery, and lead generation for businesses of all types.`,
    problems: {
      none: [
        "No website means missing all organic search traffic",
        "Potential customers can't find or verify your business online",
        "No way to build trust with new leads before first contact",
        "Competitors with sites have a significant advantage",
      ],
      outdated: [
        "Outdated design hurts first impressions and credibility",
        "Site performance issues hurt Google ranking",
        "Missing modern features customers now expect",
        "No lead capture mechanism to grow customer base",
      ],
      decent: [
        "Site exists but isn't optimized for conversions",
        "SEO basics may not be in place",
        "No clear primary call-to-action for visitors",
      ],
      good: [
        "Good foundation — SEO and content could drive more traffic",
        "Lead nurturing and email capture could improve retention",
        "Performance optimization could improve search rankings",
      ],
    },
    suggestions: {
      none: [
        "Build a clean, professional website with clear services",
        "Set up Google Business Profile",
        "Add contact form and phone number prominently",
        "Implement basic SEO: title tags, meta descriptions, sitemap",
      ],
      outdated: [
        "Redesign with a modern, mobile-responsive layout",
        "Fix site speed and Core Web Vitals",
        "Add clear CTA on every page",
        "Set up Google Analytics and Search Console",
      ],
      decent: [
        "Define one primary CTA per page and make it stand out",
        "Start a simple blog for SEO and industry authority",
        "Add customer testimonials and social proof",
      ],
      good: [
        "Build a content strategy targeting your core keywords",
        "Add email capture and lead nurturing sequence",
        "Explore paid search for high-intent terms",
      ],
    },
    outreach: {
      none: (i) =>
        `Hi! I was looking up ${i.businessName}${i.location ? ` in ${i.location}` : ""} and couldn't find a website. Without one, you're pretty much invisible online. I build simple, effective sites for small businesses. Worth a quick chat?`,
      outdated: (i) =>
        `Hey! Found ${i.businessName} online — your site is there but it's showing its age a bit. I help businesses modernize their web presence without the headache. Want me to show you what I'd change?`,
      decent: (i) =>
        `Hi! Checked out ${i.businessName}'s site — solid foundation. Noticed a few quick wins that could bring in more leads from Google. I help businesses like yours with this. Want a free look?`,
      good: (i) =>
        `Hey! ${i.businessName}'s site looks great. There are a couple of SEO tweaks that could push you higher in search results. Happy to share them — no strings attached. Interested?`,
    },
  },
};

// ─── Main Engine Function ──────────────────────────────────────────────────────

export function analyzeAndGenerate(input: AnalysisInput): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      const category = input.category === "restaurant" ||
        input.category === "healthcare" ||
        input.category === "real_estate"
        ? input.category
        : templates[input.category]
          ? input.category
          : "other";

      const tmpl = templates[category] ?? templates["other"];
      const status = detectWebsiteStatus(input.websiteUrl);
      const confidence = calcConfidence(input, status);

      const problemSet = tmpl.problems[status];
      const suggestionSet = tmpl.suggestions[status];

      // Pick 3-4 problems and suggestions contextually
      const problems = problemSet.slice(0, input.notes ? 4 : 3);
      const suggestions = suggestionSet.slice(0, input.notes ? 4 : 3);

      const outreach = tmpl.outreach[status](input);
      const analysis = tmpl.analysis(input);

      const result: AnalysisResult = {
        id: generateId(),
        input,
        analysis,
        problems,
        suggestions,
        outreach_message: outreach,
        confidence_score: confidence,
        websiteStatus: status,
        createdAt: new Date().toISOString(),
      };

      resolve(result);
    }, 1800);
  });
}
