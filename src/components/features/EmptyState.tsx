import heroBg from "@/assets/hero-bg.jpg";

export default function EmptyState() {
  return (
    <div className="glass-panel overflow-hidden min-h-[400px] flex flex-col">
      {/* Hero image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={heroBg}
          alt="AI Marketing Agent"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-lg font-bold text-white">AI Marketing Agent</h2>
            <p className="text-xs text-slate-400 mt-1">
              For freelance web developers
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-center space-y-5">
        <div className="space-y-4">
          {[
            {
              icon: "🔍",
              title: "Spot the Problem",
              desc: "Identifies whether a business is missing a site, has an outdated one, or needs growth help.",
            },
            {
              icon: "💡",
              title: "Smart Suggestions",
              desc: "Tailored recommendations based on business type, location, and current web presence.",
            },
            {
              icon: "✉️",
              title: "Human-Like Outreach",
              desc: "Under-60-word messages that sound like a real freelancer, not a spam bot.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel-inner p-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-brand font-medium">How it works:</span> Fill in the business name, select a category, and optionally add the website URL and location. The agent handles the rest.
          </p>
        </div>
      </div>
    </div>
  );
}
