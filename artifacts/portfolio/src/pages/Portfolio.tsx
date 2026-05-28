// DESIGN READ: High-ticket freelance portfolio for international performance-marketing clients
// Vibe: Dark editorial / premium agency
// DESIGN_VARIANCE: 8 | MOTION_INTENSITY: 6 | VISUAL_DENSITY: 3
// Nav: Floating pill. Buttons: rounded-full. Eyebrows: ≤2 across entire site.
// Double-bezel on headshot/pricing. Testimonials: pull-quote (no card borders).
// Services preview: numbered editorial list. Case studies: full-width editorial rows.

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Filter, TrendingUp, Search, Mail, BarChart3,
  Calendar, Car, Home, ShoppingBag, Users, Zap, Briefcase,
  ArrowRight, Menu, X, Star,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

// ─── HEADSHOT ────────────────────────────────────────────────────────────────
// To use your real photo:
//   1. Copy the file to  artifacts/portfolio/src/assets/  (e.g. headshot.webp)
//   2. Uncomment the next line and update the filename
//   3. Replace HEADSHOT below with headshotPath
//
// import headshotPath from "@assets/headshot.webp";
const HEADSHOT = "https://picsum.photos/seed/portrait-formal-dark/480/600";

type Tab = "home" | "results" | "services" | "about";

const EASE = [0.32, 0.72, 0, 1] as const;

// Shared whileInView animation props
const inView = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, ease: EASE },
};

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────
function useCounter(target: number, prefix = "", suffix = "") {
  const [val, setVal] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const dur = 2000;
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(`${prefix}${Math.floor(eased * target).toLocaleString()}${suffix}`);
            if (p < 1) requestAnimationFrame(step);
            else setVal(`${prefix}${target.toLocaleString()}${suffix}`);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, prefix, suffix]);

  return { ref, val };
}

// ─── BUTTONS ──────────────────────────────────────────────────────────────────
function GoldPill({
  children, onClick, testId, className = "",
}: {
  children: React.ReactNode; onClick?: () => void; testId?: string; className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-testid={testId}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider ${className}`}
      style={{ background: "#D4AF37", color: "#0A0A14" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(212,175,55,0.5)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {children}
    </motion.button>
  );
}

function GhostPill({
  children, onClick, testId,
}: {
  children: React.ReactNode; onClick?: () => void; testId?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-testid={testId}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider"
      style={{ border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37", background: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </motion.button>
  );
}

// ─── METRIC CELL ──────────────────────────────────────────────────────────────
function MetricCell({ prefix, target, suffix, label }: { prefix?: string; target: number; suffix: string; label: string }) {
  const { ref, val } = useCounter(target, prefix, suffix);
  return (
    <div ref={ref} className="flex flex-col items-center py-10 px-4" data-testid={`metric-${label.replace(/\s+/g, "-").toLowerCase()}`}>
      <span
        className="text-5xl md:text-6xl font-bold leading-none tracking-tight"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D4AF37" }}
      >
        {val}
      </span>
      <span className="mt-3 text-[10px] uppercase tracking-[3px] text-center" style={{ color: "#AAAACC" }}>
        {label}
      </span>
    </div>
  );
}

// ─── DOUBLE-BEZEL PHOTO ───────────────────────────────────────────────────────
function BezelPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="p-2 rounded-[2rem] w-full"
      style={{
        background: "rgba(212,175,55,0.035)",
        border: "1px solid rgba(212,175,55,0.13)",
        boxShadow: "0 0 80px rgba(212,175,55,0.05)",
      }}
    >
      <div
        className="rounded-[calc(2rem-0.5rem)] overflow-hidden aspect-[4/5]"
        style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)" }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="eager" />
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const [open, setOpen] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "results", label: "Results" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      {/* Floating pill */}
      <div className="fixed top-4 inset-x-0 flex justify-center z-50 px-4">
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-1 px-3 py-2 rounded-full w-full max-w-2xl"
          style={{
            background: "rgba(10,10,20,0.9)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(212,175,55,0.13)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
          }}
          data-testid="navbar"
        >
          <button
            onClick={() => onChange("home")}
            className="text-xl font-bold leading-none mr-2 md:mr-3 flex-shrink-0"
            style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}
            data-testid="btn-logo"
          >
            WP.
          </button>

          {/* Tab links — desktop */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                data-testid={`nav-${t.id}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                style={{
                  color: active === t.id ? "#D4AF37" : "#AAAACC",
                  background: active === t.id ? "rgba(212,175,55,0.1)" : "transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tagline — large desktop only */}
          <p
            className="hidden lg:block text-[9px] uppercase tracking-[2.5px] text-center flex-1"
            style={{ color: "rgba(170,170,204,0.3)" }}
          >
            Performance · Precision · Results
          </p>

          {/* Book CTA — desktop */}
          <GoldPill testId="btn-book-nav" onClick={() => {}} className="hidden md:inline-flex text-[11px] px-5 py-2.5">
            Book Free Audit
          </GoldPill>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden ml-auto p-1"
            onClick={() => setOpen(true)}
            data-testid="btn-hamburger"
            style={{ color: "#D4AF37" }}
          >
            <Menu size={20} />
          </button>
        </motion.nav>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(10,10,20,0.97)", backdropFilter: "blur(32px)" }}
            data-testid="mobile-menu"
          >
            <button
              className="absolute top-6 right-6"
              onClick={() => setOpen(false)}
              style={{ color: "#D4AF37" }}
              data-testid="btn-close-menu"
            >
              <X size={24} />
            </button>

            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-8"
            >
              {tabs.map((t) => (
                <motion.button
                  key={t.id}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                  onClick={() => { onChange(t.id); setOpen(false); }}
                  data-testid={`mobile-nav-${t.id}`}
                  className="text-3xl font-bold uppercase tracking-[6px]"
                  style={{
                    color: active === t.id ? "#D4AF37" : "rgba(170,170,204,0.6)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {t.label}
                </motion.button>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.28, ease: EASE } },
                }}
                className="mt-4"
              >
                <GoldPill testId="btn-book-mobile" onClick={() => setOpen(false)}>
                  Book Free Audit
                </GoldPill>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── STICKY BUTTONS ───────────────────────────────────────────────────────────
function StickyButtons() {
  const [exp, setExp] = useState(false);
  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-end">
      <a
        href="https://wa.me/1234567890?text=Hi%20Wisdom%2C%20I%20visited%20your%20portfolio%20and%20I%E2%80%99d%20like%20to%20discuss%20working%20together."
        target="_blank"
        rel="noopener noreferrer"
        data-testid="btn-whatsapp"
        title="Chat on WhatsApp"
        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 4px 20px rgba(37,211,102,0.28)" }}
      >
        <SiWhatsapp size={20} color="#fff" />
      </a>

      <motion.button
        onClick={() => {}}
        onMouseEnter={() => setExp(true)}
        onMouseLeave={() => setExp(false)}
        data-testid="btn-sticky-booking"
        animate={{ width: exp ? "auto" : 48 }}
        transition={{ duration: 0.24, ease: EASE }}
        className="h-12 rounded-full flex items-center gap-2.5 px-3 overflow-hidden"
        style={{ background: "#D4AF37", boxShadow: "0 4px 20px rgba(212,175,55,0.28)" }}
      >
        <Calendar size={20} style={{ color: "#0A0A14", flexShrink: 0 }} />
        <AnimatePresence>
          {exp && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap pr-1"
              style={{ color: "#0A0A14" }}
            >
              Book Free Audit
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ onTab }: { onTab: (t: Tab) => void }) {
  return (
    <div>
      {/* HERO — split layout, 4 text elements max */}
      <section
        className="min-h-[100dvh] flex items-center pt-20 pb-16"
        style={{ background: "#0A0A14" }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Text */}
            <div>
              {/* 1: Availability badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8"
                style={{
                  background: "rgba(10,10,20,0.9)",
                  border: "1px solid rgba(212,175,55,0.22)",
                }}
                data-testid="availability-badge"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse-green"
                  style={{ background: "#22c55e" }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[2.5px]" style={{ color: "#AAAACC" }}>
                  Currently accepting{" "}
                  <span style={{ color: "#D4AF37" }}>2 new clients</span>
                </span>
              </motion.div>

              {/* 2: Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.14, ease: EASE }}
                className="font-bold leading-[1.02] tracking-tight mb-7"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(40px, 5.5vw, 70px)",
                }}
              >
                <span style={{ color: "#FFFFFF" }}>I Don't Run Ads.</span>
                <br />
                <span
                  className="animate-gradient-shift"
                  style={{
                    background: "linear-gradient(90deg, #D4AF37, #00C9B1, #D4AF37)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  I Build Revenue Machines.
                </span>
              </motion.h1>

              {/* 3: Subtext — ≤20 words */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
                className="text-lg leading-relaxed mb-10 max-w-[50ch]"
                style={{ color: "#AAAACC" }}
              >
                Meta Ads, Google Ads, and automation that turns ad budgets into measurable, scalable revenue — across four continents.
              </motion.p>

              {/* 4: CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                className="flex flex-wrap gap-3"
              >
                <GoldPill testId="btn-book-hero" onClick={() => {}}>
                  Book My Free Audit
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(10,10,20,0.18)" }}
                  >
                    <ArrowRight size={13} />
                  </span>
                </GoldPill>
                <GhostPill testId="btn-results-hero" onClick={() => onTab("results")}>
                  See Results <ArrowRight size={13} />
                </GhostPill>
              </motion.div>
            </div>

            {/* Photo — double-bezel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[400px]">
                <BezelPhoto src={HEADSHOT} alt="Wisdom O. — Performance Marketing Specialist" />

                <div
                  className="absolute -top-3 -left-3 flex items-center gap-2 rounded-full px-4 py-2.5"
                  style={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(212,175,55,0.28)",
                    backdropFilter: "blur(12px)",
                  }}
                  data-testid="badge-experience"
                >
                  <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>4+</span>
                  <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>Years Experience</span>
                </div>

                <div
                  className="absolute -bottom-3 -right-3 flex items-center gap-2 rounded-full px-4 py-2.5"
                  style={{
                    background: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(212,175,55,0.28)",
                    backdropFilter: "blur(12px)",
                  }}
                  data-testid="badge-roas"
                >
                  <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>4.8×</span>
                  <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>Average ROAS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* METRICS — editorial horizontal row, no title */}
      <section
        style={{
          background: "#0A0A14",
          borderTop: "1px solid rgba(212,175,55,0.08)",
          borderBottom: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {[
              { prefix: "$", target: 300, suffix: "k+", label: "Ad Spend Managed" },
              { prefix: "", target: 4, suffix: ".8×", label: "Avg ROAS Delivered" },
              { prefix: "", target: 40, suffix: "+", label: "Campaigns Launched" },
              { prefix: "", target: 6, suffix: "", label: "Industries Mastered" },
              { prefix: "", target: 4, suffix: "", label: "Countries Served" },
            ].map((m, i) => (
              <div
                key={m.label}
                style={{ borderLeft: i > 0 ? "1px solid rgba(212,175,55,0.08)" : "none" }}
              >
                <MetricCell {...m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY MARQUEE — the one marquee on the page */}
      <section className="py-10 overflow-hidden" style={{ background: "#111122" }}>
        <p
          className="text-center text-[10px] uppercase tracking-[3px] mb-6"
          style={{ color: "rgba(170,170,204,0.35)" }}
        >
          Trusted across{" "}
          <span style={{ color: "rgba(212,175,55,0.65)" }}>6 industries</span> in{" "}
          <span style={{ color: "rgba(212,175,55,0.65)" }}>4 continents</span>
        </p>
        <div className="overflow-hidden">
          <div className="flex gap-5 animate-scroll" style={{ width: "max-content" }}>
            {[
              "Automotive", "Real Estate", "Home Services", "E-Commerce",
              "Coaching", "Energy", "Fashion", "Tech",
              "Automotive", "Real Estate", "Home Services", "E-Commerce",
              "Coaching", "Energy", "Fashion", "Tech",
            ].map((ind, i) => (
              <span
                key={i}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[2px] whitespace-nowrap"
                style={{
                  background: "rgba(212,175,55,0.05)",
                  color: "rgba(170,170,204,0.5)",
                  border: "1px solid rgba(212,175,55,0.09)",
                }}
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW — numbered editorial list, no card boxes */}
      <section className="py-36" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <motion.h2
            {...inView}
            className="font-bold mb-16 max-w-sm leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              color: "#FFFFFF",
            }}
          >
            Revenue Systems,<br />Not Ad Campaigns.
          </motion.h2>

          <div>
            {[
              {
                n: "01",
                icon: Target,
                title: "Ads That Pay for Themselves",
                body: "Meta and Google campaigns engineered for qualified leads — not impressions. Every campaign has a measurable revenue target.",
              },
              {
                n: "02",
                icon: Filter,
                title: "Funnels That Close While You Sleep",
                body: "Landing pages, WhatsApp automation, and lead qualification systems that convert ad clicks into booked appointments.",
              },
              {
                n: "03",
                icon: TrendingUp,
                title: "Strategy That Scales Beyond the First Month",
                body: "Email marketing, retargeting, and audience segmentation that compounds results over time instead of starting over monthly.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...inView}
                transition={{ duration: 0.7, delay: i * 0.09, ease: EASE }}
                className="group flex items-start gap-8 py-9"
                style={{ borderTop: "1px solid rgba(212,175,55,0.09)" }}
              >
                <span
                  className="text-[10px] font-bold mt-1.5 flex-shrink-0"
                  style={{
                    color: "rgba(212,175,55,0.4)",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "2px",
                  }}
                >
                  {s.n}
                </span>
                <s.icon
                  size={17}
                  className="mt-1.5 flex-shrink-0"
                  style={{ color: "rgba(212,175,55,0.45)" }}
                />
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold mb-2.5"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "#AAAACC" }}>
                    {s.body}
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="mt-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ color: "#D4AF37" }}
                />
              </motion.div>
            ))}

            <div className="pt-8" style={{ borderTop: "1px solid rgba(212,175,55,0.09)" }}>
              <button
                onClick={() => onTab("services")}
                data-testid="link-all-services"
                className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200"
                style={{ color: "#D4AF37" }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
                onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
              >
                All services <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — pull-quote style, no card borders (eyebrow #1 of 2 site-wide) */}
      <section className="py-36" style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[3px] mb-14"
            style={{ color: "#D4AF37" }}
          >
            Client Results
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-3 md:divide-x"
            style={{ borderColor: "rgba(212,175,55,0.09)" }}
          >
            {[
              {
                quote: "We went from relying entirely on Jiji to 23 qualified WhatsApp enquiries in 10 days. Two cars sold in 2 weeks. The ROI was immediate.",
                author: "Dealership Owner",
                location: "Lagos",
                industry: "Automotive",
              },
              {
                quote: "The booking funnel he built fills our apartment 4–5 times per week without any manual follow-up from our side. It just works, every week.",
                author: "Property Manager",
                location: "Abuja",
                industry: "Real Estate",
              },
              {
                quote: "I hired Wisdom on a 14-day trial. The results were clear enough that I extended to a 6-month retainer without a second thought.",
                author: "Business Owner",
                location: "Australia",
                industry: "International",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                {...inView}
                transition={{ duration: 0.7, delay: i * 0.11, ease: EASE }}
                className="px-0 md:px-8 py-10 first:pl-0 last:pr-0"
                data-testid={`testimonial-${i}`}
              >
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={11} fill="#D4AF37" style={{ color: "#D4AF37" }} />
                  ))}
                </div>
                <p
                  className="text-base leading-[1.8] italic mb-8"
                  style={{ color: "#FFFFFF" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#FFFFFF" }}>
                    {t.author}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-[2px] mt-1"
                    style={{ color: "rgba(212,175,55,0.55)" }}
                  >
                    {t.location} · {t.industry}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA — manifesto moment, centered (intentional) */}
      <section
        className="py-40"
        style={{ background: "#0A0A14", borderTop: "1px solid rgba(212,175,55,0.09)" }}
      >
        <div className="max-w-3xl mx-auto px-5 lg:px-10 text-center">
          <motion.h2
            {...inView}
            className="font-bold mb-5 tracking-tight leading-[1.04]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 5vw, 62px)",
              color: "#FFFFFF",
            }}
          >
            Your Competition Is Already Running Ads.
          </motion.h2>

          <motion.p
            {...inView}
            transition={{ duration: 0.7, delay: 0.09, ease: EASE }}
            className="text-xl font-bold mb-7"
            style={{ color: "#D4AF37" }}
          >
            The question is whether they're running them better than yours.
          </motion.p>

          <motion.p
            {...inView}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
            className="text-base leading-relaxed mb-12 max-w-[54ch] mx-auto"
            style={{ color: "#AAAACC" }}
          >
            Book a free 30-minute audit. I'll review your current marketing, identify the 3 things costing you the most, and show you exactly what I'd build. No pitch. No invoice.
          </motion.p>

          <motion.div
            {...inView}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="flex flex-col items-center gap-5"
          >
            <GoldPill testId="btn-claim-audit" onClick={() => {}}>
              Claim My Free Audit
            </GoldPill>
            <p className="text-[10px] uppercase tracking-[2.5px]" style={{ color: "rgba(170,170,204,0.4)" }}>
              Responding within 4 hours · Remote · Available Worldwide
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[2px]" style={{ color: "rgba(212,175,55,0.45)" }}>
              Currently accepting 2 new clients for June 2026
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── RESULTS TAB ──────────────────────────────────────────────────────────────
function ResultsTab() {
  const studies = [
    {
      industry: "AUTOMOTIVE",
      country: "WEST AFRICA",
      headline: "Car Dealer: 2 Leads/Week to 23 Qualified Buyers in 10 Days",
      challenge: "Sole reliance on marketplace listings. Zero digital presence. Cars sitting unsold for 3+ weeks.",
      metrics: [
        { l: "Ad Spend", v: "$16 USD" },
        { l: "Leads", v: "23 Qualified" },
        { l: "CPL", v: "$0.70 / lead" },
        { l: "Outcome", v: "2 Cars Sold" },
      ],
      quote: "Buyers were asking to come for inspection. Real buyers, not window-shoppers.",
      tags: ["Meta Messages Campaign", "WhatsApp Funnel"],
    },
    {
      industry: "HOME SERVICES",
      country: "WEST AFRICA",
      headline: "Solar Company: 48 Installation Enquiries in 21 Days",
      challenge: "Zero digital marketing. 100% referral-dependent. Inconsistent monthly revenue.",
      metrics: [
        { l: "CPL Before", v: "No system" },
        { l: "CPL After", v: "$0.22 / lead" },
        { l: "Leads (21d)", v: "48 Enquiries" },
        { l: "ROAS", v: "6.2×" },
      ],
      quote: "We had never run ads. Now our calendar is booked 3 weeks ahead.",
      tags: ["Meta Leads", "Google Search", "Landing Page"],
    },
    {
      industry: "E-COMMERCE",
      country: "WEST AFRICA",
      headline: "Fashion Brand: CPL Reduced 88% in 30 Days",
      challenge: "High spend, poor targeting, weak creative, and low ROAS. Campaign was bleeding budget.",
      metrics: [
        { l: "CPL Before", v: "₦850 / lead" },
        { l: "CPL After", v: "Under ₦100" },
        { l: "Leads (30d)", v: "312 Leads" },
        { l: "ROAS", v: "4.9×" },
      ],
      quote: "Same budget. Nearly 9× more leads. The targeting was the game changer.",
      tags: ["Meta Leads Rebuild", "Lookalike Audiences", "Creative Brief"],
    },
  ];

  return (
    <div className="pt-28">
      {/* Header — editorial, no eyebrow */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <motion.p
            {...inView}
            className="text-base leading-relaxed max-w-[46ch] mb-4"
            style={{ color: "#AAAACC" }}
          >
            Every business below made a decision to stop guessing and start building systems.
          </motion.p>
          <motion.h1
            {...inView}
            transition={{ duration: 0.75, delay: 0.07, ease: EASE }}
            className="font-bold leading-[1.02] tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(44px, 7vw, 88px)",
              color: "#FFFFFF",
            }}
          >
            Numbers Do Not Lie.
          </motion.h1>
          <motion.h2
            {...inView}
            transition={{ duration: 0.75, delay: 0.14, ease: EASE }}
            className="font-bold leading-[1.02] tracking-tight animate-gradient-shift"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(44px, 7vw, 88px)",
              background: "linear-gradient(90deg, #D4AF37, #00C9B1, #D4AF37)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Neither Do My Clients.
          </motion.h2>
        </div>
      </section>

      {/* Case Studies — full-width editorial rows */}
      <section style={{ background: "#111122", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          {studies.map((cs, i) => (
            <motion.div
              key={cs.industry}
              {...inView}
              transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
              className="py-16"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
              data-testid={`case-study-${cs.industry.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <span
                      className="rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[2px]"
                      style={{ background: "rgba(212,175,55,0.11)", color: "#D4AF37" }}
                    >
                      {cs.industry}
                    </span>
                    <span
                      className="rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[2px]"
                      style={{ background: "rgba(170,170,204,0.06)", color: "#AAAACC" }}
                    >
                      {cs.country}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-5 leading-snug"
                    style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {cs.headline}
                  </h3>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "#AAAACC" }}>
                    <span className="font-bold" style={{ color: "rgba(212,175,55,0.65)" }}>
                      Challenge:{" "}
                    </span>
                    {cs.challenge}
                  </p>
                  <blockquote
                    className="text-sm italic pl-4 mb-7 leading-relaxed"
                    style={{ color: "#AAAACC", borderLeft: "2px solid rgba(212,175,55,0.32)" }}
                  >
                    "{cs.quote}"
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{
                          border: "1px solid rgba(0,201,177,0.2)",
                          color: "#00C9B1",
                          background: "rgba(0,201,177,0.05)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — double-bezel metric cells */}
                <div className="grid grid-cols-2 gap-3 content-start">
                  {cs.metrics.map((m) => (
                    <div
                      key={m.l}
                      className="p-1.5 rounded-2xl"
                      style={{
                        background: "rgba(212,175,55,0.03)",
                        border: "1px solid rgba(212,175,55,0.09)",
                      }}
                    >
                      <div
                        className="p-4 rounded-[calc(1rem-0.375rem)]"
                        style={{
                          background: "#111122",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-[2px] mb-2"
                          style={{ color: "#AAAACC" }}
                        >
                          {m.l}
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{
                            color: "#D4AF37",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {m.v}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full testimonial — editorial, no card */}
      <section className="py-36" style={{ background: "#0A0A14" }}>
        <div className="max-w-4xl mx-auto px-5 lg:px-10">
          <motion.div {...inView}>
            <div className="flex gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#D4AF37" style={{ color: "#D4AF37" }} />
              ))}
            </div>
            <p
              className="text-2xl md:text-3xl font-bold leading-[1.55] italic mb-10"
              style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              "Before working with Wisdom O., we were spending on ads and guessing. After 2 weeks, I could see exactly what every naira was producing. The Looker Studio dashboard showed me cost per lead, ROAS, and pipeline in real time. I now treat the ad spend as a fixed revenue investment, not an expense."
            </p>
            <p className="font-bold" style={{ color: "#FFFFFF" }}>
              Business Owner
            </p>
            <p
              className="text-[10px] uppercase tracking-[2.5px] mt-1"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              Full-Stack Performance Marketing
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── SERVICES TAB ─────────────────────────────────────────────────────────────
function ServicesTab({ onTab }: { onTab: (t: Tab) => void }) {
  const services = [
    {
      n: "01", icon: Target, name: "PAID SOCIAL ACQUISITION",
      outcome: "Qualified Buyers Into Your Pipeline. Daily.",
      body: "Facebook and Instagram campaigns engineered to bring the right people to your business — not mass impressions, but qualified enquiries from people who have the budget, the intent, and the urgency to buy.",
      includes: ["Campaign architecture", "Audience research", "Creative brief", "Lead form setup", "Retargeting system", "Looker Studio dashboard", "Weekly reports", "Monthly optimisation"],
      markets: "Nigeria · Australia · South Africa · Ghana · US · UK",
    },
    {
      n: "02", icon: Search, name: "SEARCH INTENT CAPTURE",
      outcome: "Be the First Thing They See When They Need You Most.",
      body: "Google Search campaigns that position your business at the exact moment your ideal customer is actively searching for what you offer. Maximum intent. Minimum wasted spend.",
      includes: ["Keyword strategy", "Campaign build", "Negative keyword management", "Ad copy", "Conversion tracking", "Bid strategy", "Weekly reporting", "Google LSA for home services"],
      markets: "",
    },
    {
      n: "03", icon: Filter, name: "CONVERSION ARCHITECTURE",
      outcome: "A System That Sells While You Sleep.",
      body: "Landing pages, lead qualification forms, WhatsApp automation, and booking calendar integration — a complete acquisition system that converts cold traffic into paying customers without manual intervention.",
      includes: ["Landing page build", "Lead qualification forms", "WhatsApp automation", "Booking calendar integration", "Follow-up sequences", "Conversion optimisation"],
      markets: "",
    },
    {
      n: "04", icon: Mail, name: "AUTOMATED REVENUE SEQUENCES",
      outcome: "Every Lead Nurtured. Every Customer Retained.",
      body: "Email sequences that turn cold leads into warm prospects, warm prospects into paying clients, and paying clients into repeat buyers and referrers — running automatically while you focus on your business.",
      includes: ["Email sequence design", "Mailchimp / ActiveCampaign", "Drip campaigns", "List segmentation", "Re-engagement flows", "Monthly reporting"],
      markets: "",
    },
    {
      n: "05", icon: BarChart3, name: "GROWTH STRATEGY & AUDIT",
      outcome: "Stop Guessing. Start Knowing Exactly What to Do.",
      body: "A complete audit of your current marketing — ads, funnels, email, website, and competitors — with a 90-day action plan that tells you exactly where to invest, what to stop, and what to build next.",
      includes: ["Full marketing audit", "Competitor analysis", "Channel performance review", "90-day action plan", "Priority recommendations", "Budget allocation strategy"],
      markets: "",
    },
  ];

  const industries = [
    { icon: Car, name: "Automotive & Car Dealerships", outcome: "Sell inventory 3× faster with targeted buyer funnels" },
    { icon: Home, name: "Real Estate & Short-Let", outcome: "Fill your property pipeline with qualified enquiries" },
    { icon: Zap, name: "Home Services & Energy", outcome: "Get service calls from your local area daily" },
    { icon: ShoppingBag, name: "E-Commerce & Fashion", outcome: "Turn ad spend into measurable sales daily" },
    { icon: Users, name: "Coaches & Consultants", outcome: "Fill your calendar with qualified discovery calls" },
    { icon: Briefcase, name: "Professional Services", outcome: "Position your firm as the obvious choice in your market" },
  ];

  return (
    <div className="pt-28">
      {/* Header */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <motion.h1
            {...inView}
            className="font-bold leading-tight tracking-tight mb-7"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(36px, 5.5vw, 68px)",
              color: "#FFFFFF",
            }}
          >
            Not a Service Provider.<br />A Revenue Partner.
          </motion.h1>
          <motion.p
            {...inView}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-lg leading-relaxed max-w-[52ch]"
            style={{ color: "#AAAACC" }}
          >
            Every engagement begins with understanding your business goals and the gap between where you are and where you need to be. Revenue growth is the only measure of success.
          </motion.p>
        </div>
      </section>

      {/* Services — numbered list, border-based layout */}
      <section style={{ background: "#111122" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              {...inView}
              transition={{ duration: 0.75, delay: i * 0.07, ease: EASE }}
              className="py-16"
              style={{ borderTop: "1px solid rgba(212,175,55,0.09)" }}
              data-testid={`service-${s.n}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_1fr] gap-6 lg:gap-14 items-start">
                <span
                  className="text-[10px] font-bold pt-1"
                  style={{
                    color: "rgba(212,175,55,0.35)",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "2px",
                  }}
                >
                  {s.n}
                </span>

                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <s.icon size={15} style={{ color: "rgba(212,175,55,0.55)" }} />
                    <span
                      className="text-[10px] font-bold uppercase tracking-[2.5px]"
                      style={{ color: "rgba(212,175,55,0.45)" }}
                    >
                      {s.name}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4 leading-snug"
                    style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.outcome}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "#AAAACC" }}>
                    {s.body}
                  </p>
                  {s.markets && (
                    <p
                      className="mt-4 text-[10px] uppercase tracking-[2px]"
                      style={{ color: "rgba(212,175,55,0.4)" }}
                    >
                      Markets: {s.markets}
                    </p>
                  )}
                </div>

                <div>
                  <p
                    className="text-[10px] uppercase tracking-[2px] mb-5"
                    style={{ color: "rgba(170,170,204,0.35)" }}
                  >
                    What's Included
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                    {s.includes.map((item) => (
                      <p key={item} className="text-sm flex items-center gap-2" style={{ color: "#AAAACC" }}>
                        <span style={{ color: "#D4AF37", fontSize: "8px" }}>▸</span>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.09)" }} />
        </div>
      </section>

      {/* Industries — bento (eyebrow #2 of 2 site-wide) */}
      <section className="py-36" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <p
            className="text-[10px] font-bold uppercase tracking-[3px] mb-5"
            style={{ color: "#D4AF37" }}
          >
            Industries Served
          </p>
          <motion.h2
            {...inView}
            className="font-bold mb-14 leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(26px, 3vw, 42px)",
              color: "#FFFFFF",
            }}
          >
            6 Verticals. One Standard.
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                {...inView}
                transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
                className="p-1.5 rounded-2xl group"
                style={{
                  background: "rgba(212,175,55,0.03)",
                  border: "1px solid rgba(212,175,55,0.09)",
                }}
                data-testid={`industry-${i}`}
              >
                <div
                  className="p-6 rounded-[calc(1rem-0.375rem)] transition-colors duration-300 group-hover:bg-[rgba(212,175,55,0.035)]"
                  style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.02)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(212,175,55,0.07)" }}
                  >
                    <ind.icon size={15} style={{ color: "#D4AF37" }} />
                  </div>
                  <p className="font-bold text-sm mb-1.5" style={{ color: "#FFFFFF" }}>
                    {ind.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#AAAACC" }}>
                    {ind.outcome}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — double-bezel card */}
      <section
        className="py-36"
        style={{
          background: "#111122",
          borderTop: "1px solid rgba(212,175,55,0.08)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <motion.h2
            {...inView}
            className="font-bold mb-4 text-center leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(28px, 4vw, 50px)",
              color: "#FFFFFF",
            }}
          >
            Investment
          </motion.h2>
          <motion.p
            {...inView}
            transition={{ duration: 0.7, delay: 0.07, ease: EASE }}
            className="text-base leading-relaxed text-center mb-14"
            style={{ color: "#AAAACC" }}
          >
            Services are customised to your business goals, market, and budget.
          </motion.p>

          <motion.div
            {...inView}
            transition={{ duration: 0.7, delay: 0.13, ease: EASE }}
            className="p-2 rounded-3xl"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.13)",
            }}
          >
            <div
              className="rounded-[calc(1.5rem-0.5rem)] p-8 md:p-12"
              style={{
                background: "#0A0A14",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Nigerian Clients", value: "From ₦100,000/mo" },
                  { label: "International Clients", value: "From $1,500/mo" },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="p-5 rounded-xl"
                    style={{
                      background: "rgba(212,175,55,0.05)",
                      border: "1px solid rgba(212,175,55,0.1)",
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[2px] mb-2.5"
                      style={{ color: "#AAAACC" }}
                    >
                      {p.label}
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: "#D4AF37",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {p.value}
                    </p>
                  </div>
                ))}
              </div>

              <p
                className="text-sm leading-relaxed mb-10 text-center"
                style={{ color: "#AAAACC" }}
              >
                All new clients begin with a free 30-minute strategy audit — no payment, no commitment. If we're the right fit, I'll give you a specific proposal with exact targets and deliverables.
              </p>

              <div className="flex justify-center">
                <GoldPill testId="btn-audit-services" onClick={() => {}}>
                  Start With a Free Audit
                </GoldPill>
              </div>

              <p
                className="mt-6 text-center text-[10px] uppercase tracking-[2px]"
                style={{ color: "rgba(212,175,55,0.38)" }}
              >
                Currently accepting June 2026 intake · Limited to 3 new clients per quarter
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT TAB ────────────────────────────────────────────────────────────────
function AboutTab() {
  const skillGroups = [
    { cat: "Advertising Platforms", items: ["Meta Ads Manager", "Google Ads", "Performance Max", "Google Search"] },
    { cat: "Conversion Systems", items: ["Funnel Design", "Landing Page Build", "WhatsApp Business API", "Lead Form Architecture"] },
    { cat: "Automation & Email", items: ["Email Marketing", "Mailchimp", "ActiveCampaign", "Drip Sequences"] },
    { cat: "Analytics", items: ["Google Analytics 4", "Meta Pixel + CAPI", "Looker Studio", "UTM Tracking"] },
    { cat: "Creative", items: ["Ad Copywriting", "Script Writing", "Creative Strategy", "Canva Pro"] },
    { cat: "Strategy", items: ["Competitor Research", "Audience Architecture", "Market Analysis", "Campaign Structure"] },
  ];

  return (
    <div className="pt-28">
      {/* Header — split layout, no eyebrow */}
      <section className="py-20" style={{ background: "#0A0A14" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left — double-bezel photo */}
            <motion.div {...inView} className="relative">
              <div className="max-w-[380px]">
                <BezelPhoto src={HEADSHOT} alt="Wisdom O." />
              </div>
              <div
                className="absolute -top-3 left-4 rounded-full px-4 py-2.5"
                style={{
                  background: "rgba(10,10,20,0.95)",
                  border: "1px solid rgba(212,175,55,0.24)",
                  backdropFilter: "blur(12px)",
                }}
                data-testid="badge-remote"
              >
                <p className="text-[10px] font-bold" style={{ color: "#FFFFFF" }}>
                  Remote-First · Available Worldwide
                </p>
              </div>
              <div
                className="absolute -bottom-3 left-4 rounded-full px-4 py-2.5"
                style={{
                  background: "rgba(10,10,20,0.95)",
                  border: "1px solid rgba(212,175,55,0.24)",
                  backdropFilter: "blur(12px)",
                }}
                data-testid="badge-industries"
              >
                <p className="text-[10px] font-bold" style={{ color: "#FFFFFF" }}>
                  4+ Years · 6+ Industries
                </p>
              </div>
              <div className="mt-10 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse-green flex-shrink-0"
                  style={{ background: "#22c55e" }}
                />
                <span className="text-xs font-bold" style={{ color: "#AAAACC" }}>
                  Currently Open to New Clients
                </span>
              </div>
            </motion.div>

            {/* Right — copy */}
            <div>
              <motion.h1
                {...inView}
                className="font-bold mb-8 leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(28px, 4vw, 52px)",
                  color: "#FFFFFF",
                }}
              >
                The Strategist Behind the Numbers
              </motion.h1>

              <motion.div
                {...inView}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                className="flex flex-col gap-5 text-base leading-[1.85]"
                style={{ color: "#AAAACC" }}
              >
                <p>
                  I am Wisdom O. — a performance marketing specialist who builds paid acquisition systems for businesses that cannot afford to guess with their marketing budget. I do not manage campaigns. I engineer revenue machines — combining Meta Ads, Google Search, conversion funnels, WhatsApp automation, and email marketing into systems that produce measurable, predictable results.
                </p>
                <p>
                  My practice was built on a foundation most marketing agencies ignore: understanding the business before touching the advertising. I've worked across automotive dealerships, real estate companies, energy businesses, fashion brands, coaches, and service businesses — not as a generalist, but as a specialist who goes deep into each vertical until I understand what actually drives conversions in that specific industry and market.
                </p>
                <p>
                  My work spans Africa, Australia, North America, and Europe. I operate fully remotely, structured around my clients' business hours across time zones. The markets are different. The buying behaviour is different. But the fundamentals of building a system that generates qualified buyers — those are universal. That is where I live.
                </p>
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: "rgba(212,175,55,0.05)",
                    border: "1px solid rgba(212,175,55,0.14)",
                  }}
                >
                  <p className="font-bold mb-2 text-sm" style={{ color: "#D4AF37" }}>
                    My Guarantee
                  </p>
                  <p>
                    I only take on clients when I'm confident I can deliver results. Every engagement begins with clearly defined targets in writing: a specific number of leads, a specific CPL, a specific ROAS. If I miss those targets, I keep working without additional charge until we hit them. That is a professional standard, not a marketing promise.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        className="py-36"
        style={{ background: "#111122", borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <motion.h2
            {...inView}
            className="font-bold mb-16 leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 44px)",
              color: "#FFFFFF",
            }}
          >
            Skills &amp; Capabilities
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {skillGroups.map((cat, i) => (
              <motion.div
                key={cat.cat}
                {...inView}
                transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
                data-testid={`skills-${i}`}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[2.5px] mb-4"
                  style={{ color: "#D4AF37" }}
                >
                  {cat.cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full px-3.5 py-1.5 text-xs font-bold"
                      style={{
                        border: "1px solid rgba(212,175,55,0.18)",
                        color: "#AAAACC",
                        background: "rgba(212,175,55,0.03)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote line */}
      <section className="py-14" style={{ background: "#0A0A14" }}>
        <p
          className="text-center text-[10px] font-bold uppercase tracking-[3px]"
          style={{ color: "rgba(170,170,204,0.25)" }}
        >
          Remote-First · Serving Clients Across Africa, Australia, North America, Europe &amp; the United Kingdom
        </p>
      </section>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ onTab }: { onTab: (t: Tab) => void }) {
  return (
    <footer style={{ background: "#0A0A14", borderTop: "1px solid rgba(212,175,55,0.09)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p
              className="text-3xl font-bold"
              style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              WP.
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(170,170,204,0.35)" }}>
              wisdomperformance.com
            </p>
          </div>
          <p
            className="text-center text-[10px] uppercase tracking-[2.5px]"
            style={{ color: "rgba(170,170,204,0.3)" }}
          >
            Remote-First · Currently Open to New Clients
          </p>
          <p
            className="md:text-right text-[10px] uppercase tracking-[2.5px]"
            style={{ color: "rgba(170,170,204,0.25)" }}
          >
            Performance · Precision · Results
          </p>
        </div>

        <div
          className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(170,170,204,0.22)" }}>
            © 2026 Wisdom O. All rights reserved.
          </p>
          <div className="flex gap-6">
            {(["home", "results", "services", "about"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => onTab(t)}
                className="text-[10px] uppercase tracking-wider capitalize transition-colors duration-200"
                style={{ color: "rgba(170,170,204,0.28)" }}
                data-testid={`footer-nav-${t}`}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(170,170,204,0.28)")}
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

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [tab, setTab] = useState<Tab>("home");

  const changeTab = useCallback((t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ background: "#0A0A14", minHeight: "100vh" }}>
      <Navbar active={tab} onChange={changeTab} />

      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {tab === "home" && <HomeTab onTab={changeTab} />}
          {tab === "results" && <ResultsTab />}
          {tab === "services" && <ServicesTab onTab={changeTab} />}
          {tab === "about" && <AboutTab />}
        </motion.main>
      </AnimatePresence>

      <Footer onTab={changeTab} />
      <StickyButtons />
    </div>
  );
}
