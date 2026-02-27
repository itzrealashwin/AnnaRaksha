import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ───────────────────────────────────────────────────────────── *
 *  Global Animations                                            *
 * ───────────────────────────────────────────────────────────── */
const globalStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 0.8; }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes count-up {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }
`;

/* ───────────────────────────────────────────────────────────── *
 *  Section Wrapper                                              *
 * ───────────────────────────────────────────────────────────── */
function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`relative w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── *
 *  Animated Code Block (Hero visual — MongoDB inspired)         *
 * ───────────────────────────────────────────────────────────── */
function HeroCodeBlock() {
  return (
    <div className="relative w-full max-w-lg">
      {/* Glow backdrop */}
      <div className="absolute -inset-4 rounded-xs bg-emerald-500/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-emerald-900/50 bg-[#0a1a14] shadow-2xl shadow-emerald-950/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-emerald-900/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-[11px] font-mono text-emerald-500/60">risk_analysis.js</span>
        </div>
        {/* Code body */}
        <div className="p-5 font-mono text-[13px] leading-6 text-emerald-300/90">
          <div className="text-emerald-600/60">{"// AnnaRaksha AI Risk Engine"}</div>
          <div>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-emerald-200">analysis</span>{" "}
            <span className="text-emerald-500">=</span>{" "}
            <span className="text-violet-400">await</span>{" "}
            <span className="text-amber-300">gemini</span>
            <span className="text-emerald-500">.</span>
            <span className="text-sky-300">analyze</span>
            <span className="text-emerald-500">({"{"}</span>
          </div>
          <div className="pl-4">
            <span className="text-emerald-200">warehouse</span>
            <span className="text-emerald-500">:</span>{" "}
            <span className="text-amber-200">"WH-PUNE-042"</span>
            <span className="text-emerald-500">,</span>
          </div>
          <div className="pl-4">
            <span className="text-emerald-200">crop</span>
            <span className="text-emerald-500">:</span>{" "}
            <span className="text-amber-200">"Tomatoes"</span>
            <span className="text-emerald-500">,</span>
          </div>
          <div className="pl-4">
            <span className="text-emerald-200">temperature</span>
            <span className="text-emerald-500">:</span>{" "}
            <span className="text-orange-300">28.5</span>
            <span className="text-emerald-500">,</span>
          </div>
          <div className="pl-4">
            <span className="text-emerald-200">humidity</span>
            <span className="text-emerald-500">:</span>{" "}
            <span className="text-orange-300">78</span>
            <span className="text-emerald-500">,</span>
          </div>
          <div>
            <span className="text-emerald-500">{"})"}</span>
            <span className="text-emerald-500">;</span>
          </div>
          <div className="mt-2 text-emerald-600/60">{"// => { riskScore: 0.73, action: \"DISPATCH_NOW\" }"}</div>
          <div className="text-emerald-600/60">{"// => daysRemaining: 2, confidence: 0.94"}</div>
          <div className="mt-2">
            <span className="text-violet-400">if</span>{" "}
            <span className="text-emerald-500">(</span>
            <span className="text-emerald-200">analysis</span>
            <span className="text-emerald-500">.</span>
            <span className="text-sky-300">riskScore</span>
            {" "}
            <span className="text-emerald-500">&gt;</span>
            {" "}
            <span className="text-orange-300">0.7</span>
            <span className="text-emerald-500">)</span>
            {" "}
            <span className="text-emerald-500">{"{"}</span>
          </div>
          <div className="pl-4">
            <span className="text-amber-300">socket</span>
            <span className="text-emerald-500">.</span>
            <span className="text-sky-300">emit</span>
            <span className="text-emerald-500">(</span>
            <span className="text-amber-200">"alert:critical"</span>
            <span className="text-emerald-500">)</span>
            <span className="text-emerald-500">;</span>
            {" "}
            <span className="text-emerald-500 animate-pulse">█</span>
          </div>
          <div>
            <span className="text-emerald-500">{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── *
 *  Live Stats Ticker                                            *
 * ───────────────────────────────────────────────────────────── */
function LiveStatCard({ value, label, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xs border border-emerald-200/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-emerald-800/40 dark:bg-emerald-950/30">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  MAIN LANDING PAGE
 * ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{globalStyles}</style>

      {/* ── TOP BANNER ─────────────────────────────────────── */}
      <div className="relative z-50 w-full bg-emerald-700 px-4 py-2 text-center text-xs font-medium text-white dark:bg-emerald-900">
        <span className="mr-1">🌾</span>
        India loses ₹92,651 Cr of food post-harvest every year. We're building the fix.
        <Link to="/register" className="ml-2 underline underline-offset-2 hover:text-emerald-200 font-semibold">
          Get Early Access →
        </Link>
      </div>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🌾</span>
            <span className="font-playfair text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">
              AnnaRaksha
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline-block ml-1">अन्नरक्षा</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#impact" className="transition hover:text-foreground">Impact</a>
            <a href="#how" className="transition hover:text-foreground">How It Works</a>
            <a href="#testimonials" className="transition hover:text-foreground">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex rounded-sm border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent">
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-sm bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
            >
              Get Started
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-sm p-2 text-muted-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden animate-fade-in">
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="#features" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#impact" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Impact</a>
              <a href="#how" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#testimonials" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <Link to="/login" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <Section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-150 w-150 rounded-full bg-emerald-200/30 blur-[120px] dark:bg-emerald-800/20" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-teal-200/20 blur-[100px] dark:bg-teal-900/20" />

        <div className="relative z-10 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — Text */}
          <div className="flex flex-col gap-6">
            {/* Pill badge */}
            <div className="animate-fade-in-up opacity-0 stagger-1 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              AI-Powered Post-Harvest Intelligence
            </div>

            {/* Heading */}
            <h1 className="animate-fade-in-up opacity-0 stagger-2 font-playfair text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                One platform.
              </span>
              <br />
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                Unlimited harvest
              </span>
              <br />
              <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                potential.
              </span>
            </h1>

            {/* Sub */}
            <p className="animate-fade-in-up opacity-0 stagger-3 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Combine <strong className="text-foreground">real-time sensors</strong>,{" "}
              <strong className="text-foreground">AI predictions</strong>, and{" "}
              <strong className="text-foreground">automated alerts</strong> in one warehouse intelligence platform.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up opacity-0 stagger-4 flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xs bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
              >
                Get Started
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-xs border border-border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-accent hover:-translate-y-0.5"
              >
                Documentation
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>

          {/* Right — Code block visual */}
          <div className="animate-fade-in-up opacity-0 stagger-5 hidden md:flex justify-center">
            <HeroCodeBlock />
          </div>
        </div>

        {/* ── Trusted-by logos ─────────────────────────────── */}
        <div className="relative z-10 mt-20 border-t border-border/50 pt-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {[
              "ICAR", "NABARD", "FCI", "APMC (Maharashtra)", "AgriStack",
              "Jio Platforms", "NITI Aayog",
            ].map((name, i) => (
              <span key={i} className="text-sm font-bold tracking-wide text-foreground/70 whitespace-nowrap">
                {name}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── IMPACT STATS ────────────────────────────────────── */}
      <Section id="impact" className="py-16 md:py-24">
        <div className="rounded-xs border border-red-200/50 bg-linear-to-br from-red-50/60 via-orange-50/40 to-amber-50/30 p-8 dark:border-red-900/30 dark:from-red-950/20 dark:via-orange-950/10 dark:to-amber-950/5 md:p-14">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
            The Crisis Nobody Talks About
          </p>
          <h2 className="mb-10 text-center font-playfair text-2xl font-bold md:text-3xl">
            India's post-harvest loss is a <span className="text-red-600 dark:text-red-400">₹92,651 Crore</span> problem
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {[
              { stat: "18%", label: "Post-harvest loss rate in India", icon: "📉" },
              { stat: "₹92,651 Cr", label: "Lost every single year", icon: "💸" },
              { stat: "40%", label: "Fruits & vegetables lost before market", icon: "🍅" },
              { stat: "7 Crore", label: "Farmers affected annually", icon: "👨‍🌾" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="mb-2 text-3xl">{s.icon}</span>
                <p className="font-playfair text-3xl font-bold text-red-700 dark:text-red-400 md:text-4xl">{s.stat}</p>
                <p className="mt-1.5 text-xs text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SKILLS / LEARN SECTION (MongoDB-style 3 cards) ── */}
      <Section className="py-16 md:py-24">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Platform Capabilities</p>
            <h2 className="font-playfair text-3xl font-bold md:text-4xl">
              Level Up Your <span className="text-emerald-600 dark:text-emerald-400">Warehouse Intelligence</span>
            </h2>
          </div>
          <a href="#features" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
            All features
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
        <p className="mb-10 max-w-xl text-muted-foreground">
          Access the tools, intelligence, and automation you need to monitor, predict, and protect — all from one dashboard.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "📡",
              title: "Real-Time Monitoring Hub",
              desc: "Track temperature, humidity, and environmental conditions across every storage unit. Instant breach notifications.",
              link: "Start monitoring →",
            },
            {
              icon: "🧠",
              title: "Build Smarter with AI",
              desc: "Gemini-powered risk scoring, shelf-life prediction, and intelligent action recommendations — no ML expertise needed.",
              link: "Explore AI features →",
            },
            {
              icon: "🔮",
              title: "Predictive Forecasting",
              desc: "7-day warehouse forecasts using advanced time-series analysis. Know what will happen before it happens.",
              link: "See forecasts →",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-1 dark:hover:border-emerald-700"
            >
              <span className="text-3xl mb-4">{card.icon}</span>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{card.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 transition-colors">
                {card.link}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── BENTO GRID ──────────────────────────────────────── */}
      <Section id="features" className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Feature Set</p>
          <h2 className="font-playfair text-3xl font-bold md:text-4xl mb-3">
            Everything You Need to
            <span className="text-emerald-600 dark:text-emerald-400"> Protect Your Produce</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Six powerful modules working together — from sensor to dispatch.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          <BentoCard className="md:row-span-2" icon="🌡️" tag="REAL-TIME" tagColor="emerald"
            title="Live Sensor Monitoring"
            body="Temperature and humidity tracked across every storage unit, every 5 minutes. The moment conditions shift — you know first."
          />
          <BentoCard icon="🤖" tag="AI POWERED" tagColor="amber"
            title="Gemini AI Risk Engine"
            body="Not just alerts — predictions. Our AI tells you which batch will spoil, when, and exactly what to do about it."
          />
          <BentoCard icon="📦" tag="TRACEABILITY" tagColor="sky"
            title="Full Batch Lifecycle"
            body="From farm gate to dispatch. Every kilogram tracked, every movement logged. Complete transparency."
          />
          <BentoCard className="md:col-span-2" icon="🔮" tag="FORECASTING" tagColor="teal"
            title="7-Day Warehouse Forecast"
            body="Don't react. Anticipate. AnnaRaksha reads your warehouse trends and tells you what will go wrong before it does — giving you a full week to act smarter, dispatch faster, and waste nothing."
          />
          <BentoCard icon="🚨" tag="INSTANT" tagColor="red"
            title="Zero-Delay Alerts"
            body="Critical risk? You're notified in under 30 seconds. Socket-powered. No refresh needed."
          />
          <BentoCard icon="📊" tag="ANALYTICS" tagColor="emerald"
            title="Loss Prevention Reports"
            body="See exactly how much produce you saved, which units underperformed, and where your highest risks live."
          />
        </div>
      </Section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <Section id="how" className="py-16 md:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">How It Works</p>
          <h2 className="font-playfair text-3xl font-bold md:text-4xl mb-3">
            From Sensor to Saved Harvest in <span className="text-emerald-600 dark:text-emerald-400">5&nbsp;Steps</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            A transparent pipeline — no black boxes.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-0 md:grid-cols-5">
          {/* connecting line */}
          <div className="pointer-events-none absolute top-10 hidden h-0.5 w-full md:block">
            <div className="h-full w-full bg-linear-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
          </div>

          {[
            { n: "01", icon: "🌡️", title: "Sensors Collect", body: "Temperature & humidity captured from all units every 5 minutes." },
            { n: "02", icon: "⚙️", title: "Rules Engine Checks", body: "Threshold crossed? Our smart rules engine fires before touching AI." },
            { n: "03", icon: "🤖", title: "Gemini Analyzes", body: "AI calculates exact risk score, days remaining, and recommended action." },
            { n: "04", icon: "🚨", title: "Alert Dispatched", body: "Real-time alert on your dashboard in under 30 seconds via Socket.io." },
            { n: "05", icon: "✅", title: "Manager Acts", body: "Resolve, dispatch, or re-analyze. Every action logged for full audit." },
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center px-3 py-6 text-center group">
              <div className="z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-2xl shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/60">
                {step.icon}
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step {step.n}</p>
              <p className="mt-1 text-sm font-semibold">{step.title}</p>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── THREE PILLARS ──────────────────────────────────── */}
      <Section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Core Pillars</p>
          <h2 className="font-playfair text-3xl font-bold md:text-4xl mb-3">
            Built for the Warehouse Floor. <span className="text-emerald-600 dark:text-emerald-400">Not a Boardroom.</span>
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Three pillars. One mission — zero waste.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureColumn title="MONITOR" icon="📡" color="emerald" items={[
            { icon: "🌡️", text: "Live temperature per unit" },
            { icon: "💧", text: "Humidity tracking" },
            { icon: "📈", text: "24-hour trend graphs" },
            { icon: "⚠️", text: "Threshold breach detection" },
            { icon: "🔔", text: "Instant push notifications" },
          ]} />
          <FeatureColumn title="PREDICT" icon="🧠" color="violet" items={[
            { icon: "🧠", text: "AI spoilage risk scoring" },
            { icon: "📅", text: "Days-remaining estimation" },
            { icon: "🔮", text: "7-day warehouse forecast" },
            { icon: "📉", text: "Deterioration trend detection" },
            { icon: "🚩", text: "Early warning system" },
          ]} />
          <FeatureColumn title="ACT" icon="🎯" color="amber" items={[
            { icon: "📦", text: "One-click batch dispatch" },
            { icon: "✅", text: "Alert resolve workflow" },
            { icon: "📋", text: "Full audit trail" },
            { icon: "👨‍🌾", text: "Farmer batch traceability" },
            { icon: "📊", text: "Weekly health summary" },
          ]} />
        </div>
      </Section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <Section id="testimonials" className="py-16 md:py-24">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">From the Field</p>
            <h2 className="font-playfair text-3xl font-bold md:text-4xl">
              Loved by warehouses, <span className="text-emerald-600 dark:text-emerald-400">trusted by farmers</span>
            </h2>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            View all stories
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote: "Pehle pata hi nahi chalta tha ki kaunsa batch kharab ho raha hai. AnnaRaksha ne 3 hafte mein 2 lakh ka loss rokaa.",
              name: "Ramesh Patil",
              role: "Warehouse Manager, Pune",
              avatar: "RP",
              saved: "₹2L saved in 3 weeks",
            },
            {
              quote: "The 7-day forecast alone changed how we plan our dispatches. We used to guess. Now we know.",
              name: "Suresh Agarwal",
              role: "Cold Storage Owner, Nashik",
              avatar: "SA",
              saved: "30% fewer dispatch delays",
            },
            {
              quote: "Setup 20 minutes mein ho gaya. Pehle hi din alert aa gaya — aur humne 800kg tomatoes bachaa liye.",
              name: "Priya Nair",
              role: "Agri Aggregator, Coimbatore",
              avatar: "PN",
              saved: "800 kg saved on Day 1",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {t.saved}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CROP SUPPORT — Marquee Ribbon ───────────────────── */}
      <Section className="py-16 md:py-20 overflow-hidden">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Crop Support</p>
          <h2 className="font-playfair text-3xl font-bold md:text-4xl">
            Works With Every <span className="text-emerald-600 dark:text-emerald-400">Major Indian Crop</span>
          </h2>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent" />
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 gap-4">
              {[
                "🍅 Tomatoes", "🥔 Potatoes", "🧅 Onions", "🌾 Wheat",
                "🍚 Rice", "🍎 Apples", "🥭 Mangoes", "🍇 Grapes",
                "🌽 Maize", "🥕 Carrots", "🫑 Capsicum", "🍌 Bananas",
                "🍋 Lemons", "🥦 Broccoli", "🍠 Sweet Potato", "🧄 Garlic",
              ].map((crop, i) => (
                <span
                  key={`a-${i}`}
                  className="whitespace-nowrap rounded-full border border-emerald-200/70 bg-emerald-50/80 px-5 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  {crop}
                </span>
              ))}
            </div>
            <div className="animate-marquee flex shrink-0 gap-4" aria-hidden="true">
              {[
                "🍅 Tomatoes", "🥔 Potatoes", "🧅 Onions", "🌾 Wheat",
                "🍚 Rice", "🍎 Apples", "🥭 Mangoes", "🍇 Grapes",
                "🌽 Maize", "🥕 Carrots", "🫑 Capsicum", "🍌 Bananas",
                "🍋 Lemons", "🥦 Broccoli", "🍠 Sweet Potato", "🧄 Garlic",
              ].map((crop, i) => (
                <span
                  key={`b-${i}`}
                  className="whitespace-nowrap rounded-full border border-emerald-200/70 bg-emerald-50/80 px-5 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── TECH STACK / INTEGRATIONS BAR ──────────────────── */}
      <Section className="py-12 border-y border-border/40">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Works seamlessly with your tech stack</p>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer">
            Explore ecosystem
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-4 opacity-50">
          {["MongoDB", "Google Cloud", "Gemini AI", "Socket.io", "Node.js", "React", "Redis", "Docker"].map((tech, i) => (
            <span key={i} className="text-sm font-bold tracking-wide text-foreground/80 whitespace-nowrap">{tech}</span>
          ))}
        </div>
      </Section>

      {/* ── FINAL CTA — MongoDB-style dual cards ─────────── */}
      <Section className="py-20 md:py-32">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold md:text-5xl">
            Your AI Warehouse Platform is <span className="text-emerald-600 dark:text-emerald-400">Ready</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1 — Start */}
          <div className="relative overflow-hidden rounded-xs border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50/50 p-8 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/20 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Start Now</p>
            <h3 className="font-playfair text-2xl font-bold mb-3">
              Start protecting your warehouse today
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Complete platform—free deployment. Deploy AI features faster on an all-in-one data platform.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xs bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              Get Started
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* Card 2 — Learn */}
          <div className="relative overflow-hidden rounded-xs border border-border bg-card p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Learn & Explore</p>
            <h3 className="font-playfair text-2xl font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {[
                { icon: "📚", label: "Documentation", desc: "Complete API reference & guides" },
                { icon: "📊", label: "Dashboard Demo", desc: "See the live warehouse dashboard" },
                { icon: "🎓", label: "Setup Guide", desc: "Get running in 20 minutes" },
                { icon: "💰", label: "ROI Calculator", desc: "Estimate your savings potential" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 rounded-sm px-3 py-2 transition hover:bg-accent cursor-pointer group">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <svg className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌾</span>
              <span className="font-playfair text-lg font-bold text-emerald-800 dark:text-emerald-300">AnnaRaksha</span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">अन्नरक्षा</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Protecting every grain. Empowering every farmer. India's first AI-powered post-harvest intelligence platform.
            </p>
          </div>

          <FooterCol title="Product" links={["Features", "Pricing", "Changelog", "Roadmap"]} />
          <FooterCol title="Company" links={["About", "Blog", "Careers", "Press"]} />
          <FooterCol title="Support" links={["Documentation", "API Reference", "Contact", "System Status"]} />
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <p>© 2025 AnnaRaksha. Built for Indian Agriculture 🇮🇳</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition">Privacy</a>
              <a href="#" className="hover:text-foreground transition">Terms</a>
              <a href="#" className="hover:text-foreground transition">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── *
 *  Sub-Components                                               *
 * ───────────────────────────────────────────────────────────── */

const tagColors = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  amber:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  sky:     "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  teal:    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  red:     "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function BentoCard({ icon, tag, tagColor = "emerald", title, body, className = "" }) {
  return (
    <div
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 dark:hover:border-emerald-700 ${className}`}
    >
      {/* Subtle gradient hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-50/0 to-emerald-50/0 transition-all duration-500 group-hover:from-emerald-50/50 group-hover:to-teal-50/30 dark:group-hover:from-emerald-950/20 dark:group-hover:to-teal-950/10" />
      <div className="relative z-10">
        <span className="text-3xl">{icon}</span>
        <span className={`mt-3 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagColors[tagColor]}`}>
          {tag}
        </span>
        <h3 className="mt-2 text-base font-semibold md:text-lg">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">{body}</p>
      </div>
    </div>
  );
}

function FeatureColumn({ title, icon, color = "emerald", items }) {
  const borderColorMap = {
    emerald: "hover:border-emerald-300 dark:hover:border-emerald-700",
    violet: "hover:border-violet-300 dark:hover:border-violet-700",
    amber: "hover:border-amber-300 dark:hover:border-amber-700",
  };
  return (
    <div className={`rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:shadow-md ${borderColorMap[color] || borderColorMap.emerald}`}>
      <div className="mb-5 flex items-center gap-2.5">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="text-base">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l, i) => (
          <li key={i}>
            <a href="#" className="text-sm text-muted-foreground transition hover:text-foreground">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}