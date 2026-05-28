import { useState, useEffect, useRef, useCallback } from "react";
import {
  Target, Filter, TrendingUp, Search, Mail, BarChart3,
  Calendar, Trophy, Car, Home, ShoppingBag, Users, Zap,
  Briefcase, ChevronRight, Star, Menu, X, Quote
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

type Tab = "home" | "results" | "services" | "about";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

function useCounter(target: number, suffix: string, prefix: string = "", duration = 2000) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            setValue(`${prefix}${current.toLocaleString()}${suffix}`);
            if (progress < 1) requestAnimationFrame(step);
            else setValue(`${prefix}${target.toLocaleString()}${suffix}`);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, prefix, duration]);

  return { ref, value };
}

function MetricCard({ prefix, target, suffix, label }: { prefix?: string; target: number; suffix: string; label: string }) {
  const { ref, value } = useCounter(target, suffix, prefix || "");
  return (
    <div ref={ref} className="flex flex-col items-center p-6">
      <span
        className="text-4xl md:text-5xl font-bold"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D4AF37" }}
        data-testid={`metric-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {value}
      </span>
      <span className="mt-2 text-xs uppercase tracking-widest text-center" style={{ color: "#AAAACC", letterSpacing: "2px" }}>
        {label}
      </span>
    </div>
  );
}

function AvailabilityBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
      style={{
        background: "rgba(10,10,20,0.9)",
        border: "1px solid #D4AF37",
      }}
      data-testid="availability-badge"
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse-green flex-shrink-0"
        style={{ background: "#22c55e", display: "inline-block" }}
      />
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#AAAACC", letterSpacing: "2px" }}>
        Currently accepting <span style={{ color: "#D4AF37" }}>2 new clients</span>
      </span>
    </div>
  );
}

function GoldButton({ children, onClick, className = "", testId = "" }: { children: React.ReactNode; onClick?: () => void; className?: string; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 hover-glow ${className}`}
      style={{ background: "#D4AF37", color: "#0A0A14" }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, className = "", testId = "" }: { children: React.ReactNode; onClick?: () => void; className?: string; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${className}`}
      style={{ border: "1px solid #D4AF37", color: "#D4AF37", background: "transparent" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}

function ServiceCard({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div
      className="card-hover p-8 rounded-xl flex flex-col gap-4"
      style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.15)" }}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
        <Icon size={22} style={{ color: "#D4AF37" }} />
      </div>
      <h3 className="text-lg font-bold" style={{ color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#AAAACC" }}>{body}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, industry }: { quote: string; author: string; role: string; industry: string }) {
  return (
    <div
      className="card-hover p-8 rounded-xl flex flex-col gap-6"
      style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.15)" }}
    >
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#D4AF37" style={{ color: "#D4AF37" }} />
        ))}
      </div>
      <Quote size={28} style={{ color: "#D4AF37", opacity: 0.6 }} />
      <p className="text-base leading-relaxed italic" style={{ color: "#AAAACC" }}>{quote}</p>
      <div>
        <p className="font-bold text-sm" style={{ color: "#FFFFFF" }}>{author}</p>
        <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#D4AF37", letterSpacing: "2px" }}>{role} · {industry}</p>
      </div>
    </div>
  );
}

function CaseStudyCard({
  industry, country, headline, challenge, metrics, quote, tags
}: {
  industry: string; country: string; headline: string; challenge: string;
  metrics: { label: string; value: string }[];
  quote: string; tags: string[];
}) {
  return (
    <div
      className="card-hover rounded-xl overflow-hidden"
      style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.15)" }}
      data-testid={`case-study-${industry.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="p-8 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", letterSpacing: "2px" }}>
            {industry}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "rgba(170,170,204,0.08)", color: "#AAAACC", letterSpacing: "2px" }}>
            {country}
          </span>
        </div>
        <h3 className="text-xl font-bold leading-snug" style={{ color: "#FFFFFF" }}>{headline}</h3>
        <p className="text-sm" style={{ color: "#AAAACC" }}><span style={{ color: "#D4AF37", fontWeight: 700 }}>Challenge:</span> {challenge}</p>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg p-3" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)" }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#AAAACC", letterSpacing: "1px" }}>{m.label}</p>
              <p className="font-bold" style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</p>
            </div>
          ))}
        </div>
        <blockquote className="italic text-sm border-l-2 pl-4" style={{ color: "#AAAACC", borderColor: "#D4AF37" }}>"{quote}"</blockquote>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(0,201,177,0.08)", color: "#00C9B1", border: "1px solid rgba(0,201,177,0.2)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeTab({ onTabChange }: { onTabChange: (tab: Tab) => void }) {
  useScrollReveal();

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="flex flex-col">
              <div className="slide-up-fade delay-200">
                <AvailabilityBadge />
              </div>
              <div className="slide-up-fade delay-200">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "4px" }}>
                  Performance Marketing Specialist
                </p>
              </div>
              <div className="slide-up-fade delay-500">
                <h1 className="font-bold leading-tight mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: "#FFFFFF" }}>
                  I Don&apos;t Run Ads.
                </h1>
              </div>
              <div className="slide-up-fade delay-700">
                <h1
                  className="font-bold leading-tight mb-6 animate-gradient-shift"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(36px, 5vw, 60px)",
                    background: "linear-gradient(90deg, #D4AF37, #00C9B1, #D4AF37)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  I Build Revenue Machines.
                </h1>
              </div>
              <div className="slide-up-fade delay-900">
                <p className="text-lg leading-relaxed mb-8" style={{ color: "#AAAACC" }}>
                  Meta Ads, Google Ads, Conversion Funnels, and Marketing Automation that turn ad budgets into measurable, scalable revenue — for automotive dealerships, real estate companies, service businesses, and brands across Africa, Australia, North America, and Europe.
                </p>
              </div>
              <div className="slide-up-fade delay-1100 flex flex-col sm:flex-row gap-4">
                <GoldButton testId="btn-book-audit-hero" onClick={() => {}}>
                  Book My Free Audit Call
                </GoldButton>
                <OutlineButton testId="btn-see-results-hero" onClick={() => onTabChange("results")}>
                  See What I Have Built <ChevronRight size={14} className="inline ml-1" />
                </OutlineButton>
              </div>
              <div className="slide-up-fade delay-1100 mt-4">
                <p className="text-xs" style={{ color: "#AAAACC" }}>No pitch. No invoice. Just 30 minutes of honest marketing strategy.</p>
              </div>
            </div>
            {/* Right — Headshot Placeholder */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                <div
                  className="w-full aspect-[3/4] rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #111122 0%, #1a1a3e 40%, #0d1a2e 100%)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    boxShadow: "0 0 60px rgba(212,175,55,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative lines */}
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.07) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 80%, rgba(0,201,177,0.05) 0%, transparent 60%)" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <span className="text-3xl font-bold" style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}>WO</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "3px" }}>Headshot</p>
                  </div>
                </div>
                {/* Badge 1 */}
                <div
                  className="absolute -top-4 -left-4 px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: "#0A0A14", border: "1px solid #D4AF37", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                  data-testid="badge-experience"
                >
                  <Trophy size={14} style={{ color: "#D4AF37" }} />
                  <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>4+ Years Experience</span>
                </div>
                {/* Badge 2 */}
                <div
                  className="absolute -bottom-4 -right-4 px-3 py-2 rounded-lg flex items-center gap-2"
                  style={{ background: "#0A0A14", border: "1px solid #D4AF37", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                  data-testid="badge-roas"
                >
                  <TrendingUp size={14} style={{ color: "#D4AF37" }} />
                  <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>4.8x Average ROAS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 reveal" style={{ background: "#111122", borderTop: "1px solid rgba(212,175,55,0.1)", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y sm:divide-y-0" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
            <MetricCard prefix="$" target={300} suffix="k+" label="Ad Spend Managed" />
            <MetricCard target={4} suffix=".8x" label="Avg ROAS Delivered" />
            <MetricCard target={40} suffix="+" label="Campaigns Launched" />
            <MetricCard target={6} suffix="" label="Industries Mastered" />
            <MetricCard target={4} suffix="" label="Countries Served" />
          </div>
        </div>
      </section>

      {/* Industry Strip */}
      <section className="py-12 reveal overflow-hidden" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6">
          <p className="text-center text-xs uppercase tracking-widest" style={{ color: "#AAAACC", letterSpacing: "2px" }}>
            Trusted by businesses across <span style={{ color: "#D4AF37" }}>6 industries</span> in <span style={{ color: "#D4AF37" }}>4 continents</span>
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll whitespace-nowrap" style={{ width: "max-content" }}>
            {["Automotive", "Real Estate", "Home Services", "E-Commerce", "Coaching", "Energy", "Fashion", "Tech",
              "Automotive", "Real Estate", "Home Services", "E-Commerce", "Coaching", "Energy", "Fashion", "Tech"].map((industry, i) => (
              <span
                key={i}
                className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider inline-block"
                style={{ background: "rgba(212,175,55,0.06)", color: "rgba(170,170,204,0.7)", border: "1px solid rgba(212,175,55,0.12)", letterSpacing: "2px" }}
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 reveal" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "4px" }}>WHAT I BUILD</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Revenue Systems, Not Ad Campaigns</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard icon={Target} title="Ads That Pay for Themselves" body="Meta and Google campaigns engineered for qualified leads, not just impressions. Every campaign has a measurable revenue target." />
            <ServiceCard icon={Filter} title="Funnels That Close While You Sleep" body="Landing pages, WhatsApp automation, and lead qualification systems that turn ad clicks into booked appointments and closed deals." />
            <ServiceCard icon={TrendingUp} title="Strategy That Scales Beyond the First Month" body="Email marketing, retargeting, and audience segmentation that compounds results over time instead of starting over every month." />
          </div>
          <div className="text-center mt-10">
            <button
              className="text-sm font-bold inline-flex items-center gap-2 transition-all duration-200"
              style={{ color: "#D4AF37" }}
              onClick={() => onTabChange("services")}
              data-testid="link-see-all-services"
              onMouseEnter={e => (e.currentTarget.style.color = "#00C9B1")}
              onMouseLeave={e => (e.currentTarget.style.color = "#D4AF37")}
            >
              See every service I offer <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 reveal" style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "4px" }}>CLIENT RESULTS</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What Clients Say After Working With Wisdom O.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="We went from relying entirely on Jiji to getting 23 qualified WhatsApp messages from serious buyers in the first 10 days. Two cars sold in the first 2 weeks. The ROI was immediate."
              author="Dealership Owner"
              role="Lagos"
              industry="AUTOMOTIVE"
            />
            <TestimonialCard
              quote="The booking funnel he built fills our apartment 4-5 times per week without any manual follow-up from our side. It just works — every week, without us touching it."
              author="Property Manager"
              role="Abuja"
              industry="REAL ESTATE"
            />
            <TestimonialCard
              quote="I hired Wisdom O. on a 14-day free trial. The results were clear enough that I extended to a 6-month retainer without a second thought. He understands both the marketing and the business logic behind it."
              author="Business Owner"
              role="Australia"
              industry="INTERNATIONAL"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 reveal" style={{ background: "#0A0A14", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF" }}>
            Your Competition Is Already Running Ads.
          </h2>
          <p className="text-xl font-bold mb-6" style={{ color: "#D4AF37" }}>
            The question is whether they are running them better than yours.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: "#AAAACC" }}>
            Book a free 30-minute audit. I will review your current marketing, identify the 3 things costing you the most money, and show you exactly what I would build for your business. No pitch. No invoice.
          </p>
          <GoldButton testId="btn-claim-audit" onClick={() => {}} className="text-base px-10 py-4">
            Claim My Free Audit
          </GoldButton>
          <p className="mt-4 text-sm" style={{ color: "#AAAACC" }}>
            Responding within 4 hours · Remote · Available Worldwide
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#D4AF37", letterSpacing: "2px" }}>
            Currently accepting 2 new clients for June 2026
          </p>
        </div>
      </section>
    </div>
  );
}

function ResultsTab() {
  useScrollReveal();

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "4px" }}>PROVEN OUTCOMES</p>
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF" }}>Numbers Do Not Lie.</h1>
          <h2
            className="text-4xl font-bold mb-8 animate-gradient-shift"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(90deg, #D4AF37, #00C9B1, #D4AF37)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Neither Do My Clients.
          </h2>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "#AAAACC" }}>
            Every result below came from a real campaign, a real budget, and a real business that needed to grow. Numbers are presented in USD equivalent or as performance multiples where client confidentiality applies.
          </p>
          <p className="mt-4 text-sm font-bold" style={{ color: "#D4AF37" }}>
            Every business below made a decision to stop guessing and start building systems. Here is what happened next.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 reveal" style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CaseStudyCard
              industry="AUTOMOTIVE"
              country="WEST AFRICA"
              headline="Car Dealer: 2 Leads/Week to 23 Qualified Buyers in 10 Days"
              challenge="Sole reliance on marketplace listings. Zero digital presence. Cars sitting unsold for 3+ weeks."
              metrics={[
                { label: "Ad Spend", value: "$16 USD" },
                { label: "Leads", value: "23 Qualified" },
                { label: "CPL", value: "$0.70/lead" },
                { label: "Outcome", value: "2 Cars Sold" },
              ]}
              quote="Buyers were asking to come for inspection. Not just asking how much. Real buyers."
              tags={["Meta Messages Campaign", "WhatsApp Funnel"]}
            />
            <CaseStudyCard
              industry="HOME SERVICES"
              country="WEST AFRICA"
              headline="Solar Company: 48 Installation Enquiries in 21 Days"
              challenge="Zero digital marketing. 100% referral-dependent. Inconsistent revenue."
              metrics={[
                { label: "CPL Before", value: "No system" },
                { label: "CPL After", value: "$0.22/lead" },
                { label: "Leads (21d)", value: "48 Enquiries" },
                { label: "ROAS", value: "6.2x" },
              ]}
              quote="We had never run ads. Now our calendar is booked 3 weeks ahead."
              tags={["Meta Leads", "Google Search", "Landing Page"]}
            />
            <CaseStudyCard
              industry="E-COMMERCE"
              country="WEST AFRICA"
              headline="Fashion Brand: CPL Reduced 88% in 30 Days"
              challenge="High ad spend, poor targeting, weak creative. Low ROAS."
              metrics={[
                { label: "CPL Before", value: "₦850/lead" },
                { label: "CPL After", value: "Under ₦100" },
                { label: "Leads (30d)", value: "312 Leads" },
                { label: "ROAS", value: "4.9x" },
              ]}
              quote="Same budget. Nearly 9x more leads. The targeting was the game changer."
              tags={["Meta Leads Rebuild", "Lookalike Audiences", "Creative Brief"]}
            />
          </div>
        </div>
      </section>

      {/* Full Testimonial */}
      <section className="py-20 reveal" style={{ background: "#0A0A14" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="p-10 rounded-2xl" style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.2)" }}>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#D4AF37" style={{ color: "#D4AF37" }} />)}
            </div>
            <Quote size={40} style={{ color: "#D4AF37", opacity: 0.5 }} className="mb-6" />
            <p className="text-lg leading-relaxed italic mb-8" style={{ color: "#AAAACC" }}>
              "Before working with Wisdom O., we were spending on ads and guessing. After 2 weeks, I could see exactly what every naira was producing. The Looker Studio dashboard he built showed me our cost per lead, our ROAS, and our pipeline in real time. That level of transparency and accountability is what made me extend the contract. I now treat the ad spend as a fixed revenue investment, not an expense."
            </p>
            <div>
              <p className="font-bold" style={{ color: "#FFFFFF" }}>Business Owner</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#D4AF37", letterSpacing: "2px" }}>Full-Stack Performance Marketing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicesTab({ onTabChange }: { onTabChange: (tab: Tab) => void }) {
  useScrollReveal();

  const services = [
    {
      icon: Target,
      name: "PAID SOCIAL ACQUISITION",
      outcome: "Qualified Buyers Into Your Pipeline. Daily.",
      body: "Facebook and Instagram campaigns engineered to bring the right people to your business — not mass impressions, not random clicks, but qualified enquiries from people who have the budget, the intent, and the urgency to buy from you.",
      includes: ["Campaign architecture", "Audience research", "Creative brief", "Lead form setup", "Retargeting system", "Looker Studio dashboard", "Weekly reports", "Monthly optimisation"],
      markets: "Nigeria · Australia · South Africa · Ghana · US · UK",
    },
    {
      icon: Search,
      name: "SEARCH INTENT CAPTURE",
      outcome: "Be the First Thing They See When They Need You Most.",
      body: "Google Search campaigns that position your business at the exact moment your ideal customer is actively searching for what you offer. Maximum intent. Maximum conversion rate. Minimum wasted spend.",
      includes: ["Keyword strategy", "Campaign build", "Negative keyword management", "Ad copy", "Conversion tracking", "Bid strategy", "Weekly reporting", "Google LSA for home services"],
      markets: "",
    },
    {
      icon: Filter,
      name: "CONVERSION ARCHITECTURE",
      outcome: "A System That Sells While You Sleep.",
      body: "Landing pages, lead qualification forms, WhatsApp automation, and booking calendar integration — built as a complete acquisition system that converts cold traffic into paying customers without manual intervention.",
      includes: ["Landing page design", "Lead qualification forms", "WhatsApp automation", "Booking calendar integration", "Follow-up sequences", "Conversion optimisation"],
      markets: "",
    },
    {
      icon: Mail,
      name: "AUTOMATED REVENUE SEQUENCES",
      outcome: "Every Lead Nurtured. Every Customer Retained.",
      body: "Email marketing sequences that turn cold leads into warm prospects, warm prospects into paying clients, and paying clients into repeat buyers and referrers — running automatically in the background while you focus on your business.",
      includes: ["Email sequence design", "Mailchimp / ActiveCampaign setup", "Drip campaigns", "List segmentation", "Re-engagement flows", "Monthly reporting"],
      markets: "",
    },
    {
      icon: BarChart3,
      name: "GROWTH STRATEGY & AUDIT",
      outcome: "Stop Guessing. Start Knowing Exactly What to Do.",
      body: "A complete audit of your current marketing — ads, funnels, email, website, and competitor landscape — with a 90-day action plan that tells you exactly where to invest, what to stop, and what to build next.",
      includes: ["Full marketing audit", "Competitor analysis", "Channel performance review", "90-day action plan", "Priority recommendations", "Budget allocation strategy"],
      markets: "",
    },
  ];

  const industries = [
    { icon: Car, name: "Automotive & Car Dealerships", outcome: "Sell inventory 3x faster with targeted buyer funnels" },
    { icon: Home, name: "Real Estate & Short-Let", outcome: "Fill your property pipeline with qualified enquiries" },
    { icon: Zap, name: "Home Services & Energy", outcome: "Get emergency service calls from your local area daily" },
    { icon: ShoppingBag, name: "E-Commerce & Fashion", outcome: "Turn ad spend into measurable sales daily" },
    { icon: Users, name: "Coaches & Online Consultants", outcome: "Fill your calendar with qualified discovery calls" },
    { icon: Briefcase, name: "Professional Services", outcome: "Position your firm as the obvious choice in your market" },
  ];

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "4px" }}>WHAT I BUILD FOR YOU</p>
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF" }}>
            Not a Service Provider.<br />A Revenue Partner.
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed mb-6" style={{ color: "#AAAACC" }}>
            Every engagement begins with understanding your business goals and the gap between where you are and where you need to be. Then I build the exact system that closes that gap — using paid ads, funnels, automation, and data as the tools, and your revenue growth as the only measure of success.
          </p>
          <p className="text-sm font-bold" style={{ color: "#D4AF37" }}>
            Your competitors who ARE working with a performance specialist are pulling ahead. Every month without this system is a month of revenue left on the table.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 reveal" style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-8">
          {services.map((s) => (
            <div
              key={s.name}
              className="card-hover p-8 rounded-xl"
              style={{ background: "#0A0A14", border: "1px solid rgba(212,175,55,0.15)" }}
              data-testid={`service-${s.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                      <s.icon size={20} style={{ color: "#D4AF37" }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D4AF37", letterSpacing: "3px" }}>{s.name}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}>{s.outcome}</h3>
                  <p className="leading-relaxed" style={{ color: "#AAAACC" }}>{s.body}</p>
                  {s.markets && <p className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.6)", letterSpacing: "2px" }}>Markets: {s.markets}</p>}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#AAAACC", letterSpacing: "2px" }}>What's Included</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span style={{ color: "#D4AF37", fontSize: "10px" }}>▸</span>
                        <span className="text-sm" style={{ color: "#AAAACC" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 reveal" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "4px" }}>INDUSTRIES SERVED</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>6 Verticals. One Standard.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className="card-hover p-6 rounded-xl flex gap-4 items-start"
                style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.1)" }}
                data-testid={`industry-${ind.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                  <ind.icon size={18} style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>{ind.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#AAAACC" }}>{ind.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 reveal" style={{ background: "#111122", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "4px" }}>INVESTMENT</p>
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Transparent. Results-Based.</h2>
          <div className="p-10 rounded-2xl mb-8" style={{ background: "#0A0A14", border: "1px solid rgba(212,175,55,0.2)" }}>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "#AAAACC" }}>
              Services are customised to your business goals, market, and budget.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl" style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.15)" }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#AAAACC", letterSpacing: "2px" }}>Nigerian Clients</p>
                <p className="text-2xl font-bold" style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}>From ₦100,000/mo</p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.15)" }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#AAAACC", letterSpacing: "2px" }}>International Clients</p>
                <p className="text-2xl font-bold" style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}>From $1,500/mo</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#AAAACC" }}>
              All new clients begin with a free 30-minute strategy audit — no payment, no commitment required. If we are the right fit, I will give you a specific proposal with exact targets and deliverables.
            </p>
          </div>
          <GoldButton testId="btn-start-audit-services" onClick={() => {}} className="mb-6 text-base px-10 py-4">
            Start With a Free Audit
          </GoldButton>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D4AF37", letterSpacing: "2px" }}>
            Currently accepting June 2026 intake. Limited to 3 new clients per quarter to protect delivery quality.
          </p>
        </div>
      </section>
    </div>
  );
}

function AboutTab() {
  useScrollReveal();

  const skills = [
    { category: "ADVERTISING PLATFORMS", items: ["Meta Ads Manager", "Google Ads", "Google Search", "Performance Max"] },
    { category: "CONVERSION SYSTEMS", items: ["Funnel Design", "Landing Page Build", "Lead Form Architecture", "WhatsApp Business API", "Buyer Qualification"] },
    { category: "AUTOMATION & EMAIL", items: ["Email Marketing", "Mailchimp", "ActiveCampaign", "Marketing Automation", "Drip Sequences"] },
    { category: "ANALYTICS", items: ["Google Analytics 4", "Meta Pixel + CAPI", "Looker Studio", "UTM Tracking", "Event Configuration"] },
    { category: "CREATIVE", items: ["Video Editing (CapCut)", "Graphic Design (Canva Pro)", "Ad Copywriting", "Script Writing", "Creative Strategy"] },
    { category: "STRATEGY", items: ["Competitor Research", "Audience Architecture", "Market Analysis", "Campaign Structure"] },
  ];

  return (
    <div className="pt-24">
      {/* Header + Photo */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — Photo */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm">
                <div
                  className="w-full aspect-[3/4] rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #111122 0%, #1a1a3e 50%, #0d1a2e 100%)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    boxShadow: "0 0 60px rgba(212,175,55,0.06)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <span className="text-3xl font-bold" style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}>WO</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "3px" }}>Headshot</p>
                  </div>
                </div>
                <div className="absolute -top-4 left-4 px-3 py-2 rounded-lg" style={{ background: "#0A0A14", border: "1px solid #D4AF37" }} data-testid="badge-remote">
                  <p className="text-xs font-bold" style={{ color: "#FFFFFF" }}>Remote-First | Available Worldwide</p>
                </div>
                <div className="absolute -bottom-4 right-4 px-3 py-2 rounded-lg" style={{ background: "#0A0A14", border: "1px solid #D4AF37" }} data-testid="badge-years">
                  <p className="text-xs font-bold" style={{ color: "#FFFFFF" }}>4+ Years | 6+ Industries</p>
                </div>
                <div className="mt-8 flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full animate-pulse-green" style={{ background: "#22c55e" }} />
                  <span className="text-xs font-bold" style={{ color: "#AAAACC" }}>Currently Open to New Clients</span>
                </div>
              </div>
            </div>
            {/* Right — Copy */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "4px" }}>ABOUT</p>
              <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFFFFF" }}>The Strategist Behind the Numbers</h1>
              <div className="flex flex-col gap-6 text-base leading-relaxed" style={{ color: "#AAAACC" }}>
                <p>I am Wisdom O. — a performance marketing specialist who builds paid acquisition systems for businesses that cannot afford to guess with their marketing budget. I do not manage campaigns. I engineer revenue machines — combining Meta Ads, Google Search, conversion funnels, WhatsApp automation, and email marketing into systems that produce measurable, predictable results.</p>
                <p>My practice was built on a foundation that most marketing agencies ignore: understanding the business before touching the advertising. I have worked across automotive dealerships, real estate companies, energy businesses, fashion brands, coaches, and service businesses — not as a generalist who runs ads for everyone, but as a specialist who goes deep into each vertical until I understand what actually drives conversions in that specific industry and market.</p>
                <p>My work spans across Africa, Australia, North America, and Europe. I operate fully remotely, structured around my clients&apos; business hours across time zones. The markets are different. The buying behaviour is different. The ad costs are different. But the fundamentals of building a system that generates qualified buyers — those are universal. That is where I live.</p>
                <div className="p-6 rounded-xl" style={{ background: "#111122", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <p className="font-bold mb-3" style={{ color: "#D4AF37" }}>My Guarantee</p>
                  <p>I only take on clients when I am confident I can deliver results. Every engagement begins with clearly defined targets in writing: a specific number of leads, a specific CPL, a specific ROAS. If I miss those targets, I keep working without additional charge until we hit them. That is not a marketing promise. That is a professional standard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 reveal" style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "4px" }}>EXPERTISE</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Skills & Capabilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((cat) => (
              <div key={cat.category} data-testid={`skills-${cat.category.toLowerCase().replace(/\s+/g, "-")}`}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#D4AF37", letterSpacing: "3px" }}>{cat.category}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ border: "1px solid rgba(212,175,55,0.3)", color: "#AAAACC", background: "rgba(212,175,55,0.04)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location line */}
      <section className="py-16 reveal" style={{ background: "#0A0A14" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#AAAACC", letterSpacing: "3px" }}>
            Remote-First · Serving Clients Across Africa, Australia, North America, Europe &amp; the United Kingdom
          </p>
        </div>
      </section>
    </div>
  );
}

function Navbar({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "results", label: "Results" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,20,0.95)" : "rgba(10,10,20,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,175,55,0.1)",
          height: "70px",
        }}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <button
              onClick={() => onTabChange("home")}
              className="text-2xl font-bold leading-none"
              style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}
              data-testid="btn-logo"
            >
              WP.
            </button>
            <span className="text-xs mt-0.5" style={{ color: "rgba(212,175,55,0.6)", fontSize: "8px", letterSpacing: "1px" }}>
              Currently open for June intake
            </span>
          </div>

          {/* Center — desktop only */}
          <p className="hidden lg:block text-xs uppercase tracking-widest" style={{ color: "rgba(170,170,204,0.5)", letterSpacing: "3px" }}>
            Performance. Precision. Results.
          </p>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                data-testid={`nav-${t.id}`}
                className="text-sm font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  color: activeTab === t.id ? "#D4AF37" : "#AAAACC",
                  letterSpacing: "1px",
                  borderBottom: activeTab === t.id ? "2px solid #D4AF37" : "2px solid transparent",
                  paddingBottom: "2px",
                }}
                onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.color = "#AAAACC"; }}
              >
                {t.label}
              </button>
            ))}
            <GoldButton testId="btn-book-audit-nav" onClick={() => {}} className="text-xs py-2 px-4">
              Book Free Audit
            </GoldButton>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="btn-hamburger"
            style={{ color: "#D4AF37" }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(10,10,20,0.98)", backdropFilter: "blur(20px)" }}
          data-testid="mobile-menu"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { onTabChange(t.id); setMenuOpen(false); }}
              data-testid={`mobile-nav-${t.id}`}
              className="text-2xl font-bold uppercase tracking-widest transition-all duration-200"
              style={{ color: activeTab === t.id ? "#D4AF37" : "#AAAACC", letterSpacing: "4px" }}
            >
              {t.label}
            </button>
          ))}
          <GoldButton testId="btn-book-audit-mobile" onClick={() => setMenuOpen(false)} className="mt-4 text-base px-10 py-4">
            Book Free Audit
          </GoldButton>
        </div>
      )}
    </>
  );
}

function StickyButtons() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* WhatsApp */}
      <a
        href="https://wa.me/1234567890?text=Hi%20Wisdom%2C%20I%20visited%20your%20portfolio%20and%20I'd%20like%20to%20discuss%20working%20together.%20Is%20a%2030-minute%20call%20available%20this%20week%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.3)" }}
        data-testid="btn-whatsapp"
        title="Chat on WhatsApp"
      >
        <SiWhatsapp size={22} color="#FFFFFF" />
      </a>

      {/* Booking Button */}
      <button
        onClick={() => {}}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        data-testid="btn-sticky-booking"
        className="flex items-center gap-2 rounded-full animate-pulse-gold transition-all duration-300"
        style={{
          background: "#D4AF37",
          padding: expanded ? "12px 20px" : "12px",
          boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
          width: expanded ? "auto" : "48px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <Calendar size={20} style={{ color: "#0A0A14", flexShrink: 0 }} />
        {expanded && (
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0A0A14", letterSpacing: "1px" }}>
            Book Free Audit Call
          </span>
        )}
      </button>
    </div>
  );
}

function Footer({ onTabChange }: { onTabChange: (tab: Tab) => void }) {
  return (
    <footer style={{ background: "#0A0A14", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="text-3xl font-bold mb-1" style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}>WP.</p>
            <p className="text-xs" style={{ color: "#AAAACC" }}>wisdomperformance.com</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest" style={{ color: "#AAAACC", letterSpacing: "2px" }}>
              Remote-First · Currently Open to New Clients
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-xs uppercase tracking-wider" style={{ color: "#AAAACC", letterSpacing: "2px" }}>Performance. Precision. Results.</p>
          </div>
        </div>
        <div className="mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(170,170,204,0.5)" }}>© 2026 Wisdom O. All rights reserved.</p>
          <div className="flex gap-6">
            {(["home", "results", "services", "about"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className="text-xs uppercase tracking-wider capitalize transition-all duration-200"
                style={{ color: "rgba(170,170,204,0.5)", letterSpacing: "1px" }}
                data-testid={`footer-nav-${t}`}
                onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(170,170,204,0.5)")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ background: "#0A0A14", minHeight: "100vh" }}>
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main>
        {activeTab === "home" && <HomeTab onTabChange={handleTabChange} />}
        {activeTab === "results" && <ResultsTab />}
        {activeTab === "services" && <ServicesTab onTabChange={handleTabChange} />}
        {activeTab === "about" && <AboutTab />}
      </main>

      <Footer onTabChange={handleTabChange} />
      <StickyButtons />
    </div>
  );
}
