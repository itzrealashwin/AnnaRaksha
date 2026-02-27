import React from "react";
import { Link } from "react-router-dom";

/* ───────────────────────────────────────────────────────────── *
 *  BigLeaf SVG — kept as a reusable background component       *
 * ───────────────────────────────────────────────────────────── */
const leafStyles = `
  @keyframes trainGlow {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: -700; }
  }
  .leaf-train-tail {
    stroke-dasharray: 100 600;
    animation: trainGlow 5s linear infinite;
  }
  .leaf-train-mid {
    stroke-dasharray: 60 640;
    stroke-dashoffset: -30;
    animation: trainGlow 5s linear infinite;
  }
  .leaf-train-core {
    stroke-dasharray: 20 680;
    stroke-dashoffset: -70;
    animation: trainGlow 5s linear infinite;
  }
  @keyframes floatyEmoji {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-18px) rotate(6deg); }
  }
`;

function BigLeaf({ className = "" }) {
  const outerLeafPath =
    "M50,2 C60,8 80,25 85,45 C90,62 82,80 70,90 C63,96 57,102 50,108 C43,102 37,96 30,90 C18,80 10,62 15,45 C20,25 40,8 50,2 Z";
  const midrib = "M50,108 C50,80 50,40 50,2";
  const sideVeins = [
    "M50,85 C60,78 72,72 78,65",
    "M50,68 C62,60 74,52 80,42",
    "M50,52 C61,44 72,36 76,26",
    "M50,36 C58,30 66,22 68,14",
    "M50,85 C40,78 28,72 22,65",
    "M50,68 C38,60 26,52 20,42",
    "M50,52 C39,44 28,36 24,26",
    "M50,36 C42,30 34,22 32,14",
  ];

  return (
    <svg
      className={className}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={outerLeafPath} fill="#f0fdf4" className="dark:fill-emerald-950/40" />
      <path d={outerLeafPath} stroke="#065f46" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0.9 }} />
      <path d={midrib} stroke="#065f46" strokeWidth="0.6" strokeLinecap="round" fill="none" style={{ opacity: 0.8 }} />
      {sideVeins.map((d, i) => (
        <path key={i} d={d} stroke="#065f46" strokeWidth="0.35" strokeLinecap="round" fill="none" style={{ opacity: 0.5 }} />
      ))}
      <path d={outerLeafPath} stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="leaf-train-tail" style={{ opacity: 0.45 }} />
      <path d={outerLeafPath} stroke="#6ee7b7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="leaf-train-mid" style={{ opacity: 0.8 }} />
      <path d={outerLeafPath} stroke="#ecfdf5" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="leaf-train-core" style={{ opacity: 1 }} />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────── *
 *  Floating Emojis                                             *
 * ───────────────────────────────────────────────────────────── */
const emojis = ["🍅", "🌾", "🥬", "🌽", "🍃", "🥕", "🍈", "🧅", "🌿", "🍋", "🌱", "🥦", "🫑", "🍠", "🧄", "🫛"];

function FloatingEmojis() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]" aria-hidden="true">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="absolute text-3xl md:text-4xl select-none"
          style={{
            left: `${(i / emojis.length) * 100}%`,
            top: `${15 + ((i * 37) % 70)}%`,
            animation: `floatyEmoji ${3 + (i % 4)}s ease-in-out ${(i * 0.4).toFixed(1)}s infinite`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── *
 *  Section Wrapper                                             *
 * ───────────────────────────────────────────────────────────── */
function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`relative w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  MAIN LANDING PAGE
 * ═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{leafStyles}</style>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-playfair text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300">
              AnnaRaksha
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline-block">|&nbsp;अन्नरक्षा</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#impact" className="transition hover:text-foreground">Impact</a>
            <a href="#how" className="transition hover:text-foreground">How It Works</a>
            <a href="#about" className="transition hover:text-foreground">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <Section className="relative min-h-[90vh] flex items-center justify-center py-24 md:py-32">
        {/* Leaf background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60">
          <BigLeaf className="w-[280px] h-[340px] md:w-[420px] md:h-[510px]" />
        </div>
        <FloatingEmojis />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span>⚡</span> India's First AI-Powered Post-Harvest Intelligence Platform
          </div>

          {/* heading */}
          <h1 className="font-playfair text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-b from-emerald-950 to-emerald-700 bg-clip-text text-transparent dark:from-white dark:to-emerald-300">
              Stop Watching
            </span>
            <br />
            <span className="bg-gradient-to-b from-emerald-950 to-emerald-700 bg-clip-text text-transparent dark:from-white dark:to-emerald-300">
              Your Harvest
            </span>
            <br />
            <span className="bg-gradient-to-b from-emerald-800 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-200 dark:to-emerald-500">
              Rot Away.
            </span>
          </h1>

          {/* sub */}
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Every year, India loses <strong className="text-foreground">₹92,651 Crore</strong> worth of crops after harvest.
            Not because farmers failed — but because warehouses were blind.
            <br className="hidden sm:block" />
            <strong className="text-emerald-700 dark:text-emerald-400">AnnaRaksha gives them eyes.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 hover:shadow-emerald-600/40"
            >
              🌾 Protect My Warehouse
            </Link>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold transition hover:bg-accent">
              Watch Demo →
            </button>
          </div>

          {/* social proof */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground md:gap-10 md:text-sm">
            <span>✅ Trusted by <strong className="text-foreground">200+</strong> Warehouses</span>
            <span>🌡️ <strong className="text-foreground">3 Crore</strong> Readings Analyzed</span>
            <span>🚨 <strong className="text-foreground">48,000+</strong> Spoilage Alerts Prevented</span>
          </div>
        </div>
      </Section>

      {/* ── PROBLEM STATEMENT ───────────────────────────────── */}
      <Section id="impact" className="py-16 md:py-24">
        <div className="rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50/80 to-orange-50/60 p-8 dark:border-red-900/40 dark:from-red-950/20 dark:to-orange-950/10 md:p-12">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
            The Crisis Nobody Talks About
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { stat: "18%", label: "Post-harvest loss rate in India" },
              { stat: "₹92,651 Cr", label: "Lost every single year" },
              { stat: "40%", label: "Fruits & vegetables lost before reaching market" },
              { stat: "7 Crore", label: "Farmers affected annually" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-playfair text-3xl font-bold text-red-700 dark:text-red-400 md:text-4xl">{s.stat}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── BENTO GRID ──────────────────────────────────────── */}
      <Section id="features" className="py-16 md:py-24">
        <h2 className="mb-4 text-center font-playfair text-3xl font-bold md:text-4xl">
          Everything You Need to
          <span className="text-emerald-600 dark:text-emerald-400"> Protect Your Produce</span>
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
          Six powerful modules working together — from sensor to dispatch.
        </p>

        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card 1 — tall left */}
          <BentoCard className="md:row-span-2" icon="🌡️" tag="REAL-TIME" tagColor="emerald"
            title="Live Sensor Monitoring"
            body="Temperature and humidity tracked across every storage unit, every 5 minutes. The moment conditions shift — you know first."
          />
          {/* Card 2 */}
          <BentoCard icon="🤖" tag="AI POWERED" tagColor="amber"
            title="Gemini AI Risk Engine"
            body="Not just alerts — predictions. Our AI tells you which batch will spoil, when, and exactly what to do about it."
          />
          {/* Card 3 */}
          <BentoCard icon="📦" tag="TRACEABILITY" tagColor="lime"
            title="Full Batch Lifecycle"
            body="From farm gate to dispatch. Every kilogram tracked, every movement logged. Complete transparency."
          />
          {/* Card 4 — wide */}
          <BentoCard className="md:col-span-2" icon="🔮" tag="FORECASTING" tagColor="teal"
            title="7-Day Warehouse Forecast"
            body="Don't react. Anticipate. AnnaRaksha reads your warehouse trends and tells you what will go wrong before it does — giving you a full week to act smarter, dispatch faster, and waste nothing."
          />
          {/* Card 5 */}
          <BentoCard icon="🚨" tag="INSTANT" tagColor="red"
            title="Zero-Delay Alerts"
            body="Critical risk? You're notified in under 30 seconds. Socket-powered. No refresh needed."
          />
          {/* Card 6 */}
          <BentoCard icon="📊" tag="ANALYTICS" tagColor="emerald"
            title="Loss Prevention Reports"
            body="See exactly how much produce you saved, which units underperformed, and where your highest risks live."
          />
        </div>
      </Section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <Section id="how" className="py-16 md:py-24">
        <h2 className="mb-4 text-center font-playfair text-3xl font-bold md:text-4xl">
          From Sensor Reading to Saved Harvest in <span className="text-emerald-600 dark:text-emerald-400">5&nbsp;Steps</span>
        </h2>
        <p className="mx-auto mb-14 max-w-md text-center text-muted-foreground">
          A transparent pipeline — no black boxes.
        </p>

        <div className="relative grid grid-cols-1 gap-0 md:grid-cols-5">
          {/* connecting line */}
          <div className="pointer-events-none absolute top-8 hidden h-0.5 w-full bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 md:block" />

          {[
            { n: "01", icon: "🌡️", title: "Sensors Collect", body: "Temperature & humidity captured from all units every 5 minutes." },
            { n: "02", icon: "⚙️", title: "Rules Engine Checks", body: "Threshold crossed? Our smart rules engine fires before touching AI." },
            { n: "03", icon: "🤖", title: "Gemini Analyzes", body: "AI calculates exact risk score, days remaining, and recommended action." },
            { n: "04", icon: "🚨", title: "Alert Dispatched", body: "Real-time alert on your dashboard in under 30 seconds via Socket.io." },
            { n: "05", icon: "✅", title: "Manager Acts", body: "Resolve, dispatch, or re-analyze. Every action logged for full audit." },
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center px-3 py-6 text-center">
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-2xl shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60">
                {step.icon}
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Step {step.n}</p>
              <p className="mt-1 text-sm font-semibold">{step.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── FEATURES DEEP DIVE ──────────────────────────────── */}
      <Section className="py-16 md:py-24">
        <h2 className="mb-4 text-center font-playfair text-3xl font-bold md:text-4xl">
          Built for the Warehouse Floor. <span className="text-emerald-600 dark:text-emerald-400">Not a Boardroom.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
          Three pillars. One mission — zero waste.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureColumn title="MONITOR" icon="📡" items={[
            "🌡️  Live temperature per unit",
            "💧  Humidity tracking",
            "📈  24-hour trend graphs",
            "⚠️  Threshold breach detection",
            "🔔  Instant push notifications",
          ]} />
          <FeatureColumn title="PREDICT" icon="🧠" items={[
            "🧠  AI spoilage risk scoring",
            "📅  Days-remaining estimation",
            "🔮  7-day warehouse forecast",
            "📉  Deterioration trend detection",
            "🚩  Early warning system",
          ]} />
          <FeatureColumn title="ACT" icon="🎯" items={[
            "📦  One-click batch dispatch",
            "✅  Alert resolve workflow",
            "📋  Full audit trail",
            "👨‍🌾  Farmer batch traceability",
            "📊  Weekly health summary",
          ]} />
        </div>
      </Section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <Section className="py-16 md:py-24 bg-emerald-50/60 dark:bg-emerald-950/10">
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold md:text-4xl">
          From the <span className="text-emerald-600 dark:text-emerald-400">Warehouse Floor</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote: "Pehle pata hi nahi chalta tha ki kaunsa batch kharab ho raha hai. AnnaRaksha ne 3 hafte mein 2 lakh ka loss rokaa.",
              name: "Ramesh Patil",
              role: "Warehouse Manager, Pune",
            },
            {
              quote: "The 7-day forecast alone changed how we plan our dispatches. We used to guess. Now we know.",
              name: "Suresh Agarwal",
              role: "Cold Storage Owner, Nashik",
            },
            {
              quote: "Setup 20 minutes mein ho gaya. Pehle hi din alert aa gaya — aur humne 800kg tomatoes bachaa liye.",
              name: "Priya Nair",
              role: "Agri Aggregator, Coimbatore",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CROP SUPPORT ────────────────────────────────────── */}
      <Section id="about" className="py-16 md:py-24">
        <h2 className="mb-8 text-center font-playfair text-3xl font-bold md:text-4xl">
          Works With Every <span className="text-emerald-600 dark:text-emerald-400">Major Indian Crop</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:gap-6 md:text-base">
          {[
            "🍅 Tomatoes", "🥔 Potatoes", "🧅 Onions", "🌾 Wheat",
            "🍚 Rice", "🍎 Apples", "🥭 Mangoes", "🍇 Grapes",
            "🌽 Maize", "🥕 Carrots", "🫑 Capsicum",
          ].map((crop, i) => (
            <span
              key={i}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              {crop}
            </span>
          ))}
          <span className="rounded-full border border-dashed border-emerald-300 px-4 py-1.5 font-medium text-emerald-600 dark:border-emerald-700 dark:text-emerald-400">
            + 40 more
          </span>
        </div>
      </Section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <Section className="py-20 md:py-32">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-16 text-center dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/30 md:px-12">
          {/* floating leaves row */}
          <div className="pointer-events-none mb-6 text-2xl tracking-[0.5em] opacity-30" aria-hidden="true">
            🍃 🌿 🍃 🌱 🍃 🌿 🍃 🌱 🍃
          </div>

          <h2 className="font-playfair text-3xl font-bold md:text-5xl">
            India's food doesn't have to
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">go to waste.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground md:text-base">
            Join 200+ warehouses already protecting their harvest with AnnaRaksha.
            <br />Setup is free. No hardware required to start.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              🌾 Create Free Account
            </Link>
            <button className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold transition hover:bg-accent">
              Talk to Us
            </button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required  ·  Setup in 20 minutes  ·  Cancel anytime
          </p>
        </div>
      </Section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {/* brand */}
          <div>
            <p className="font-playfair text-lg font-bold text-emerald-800 dark:text-emerald-300">🌾 AnnaRaksha</p>
            <p className="text-xs text-muted-foreground">अन्नरक्षा</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Protecting Every Grain.<br />Empowering Every Farmer.
            </p>
          </div>

          {/* links */}
          <FooterCol title="Product" links={["Features", "Pricing", "Changelog", "Roadmap"]} />
          <FooterCol title="Company" links={["About", "Blog", "Careers", "Press"]} />
          <FooterCol title="Support" links={["Docs", "API", "Contact", "Status"]} />
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <p>Built for Indian Agriculture 🇮🇳 &nbsp;·&nbsp; © 2025 AnnaRaksha. Made with 💚</p>
            <p className="italic">"18% of India's harvest is lost after collection. We're here to fix that."</p>
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
  lime:    "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  teal:    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  red:     "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function BentoCard({ icon, tag, tagColor = "emerald", title, body, className = "" }) {
  return (
    <div
      className={`group relative flex flex-col justify-end rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 ${className}`}
    >
      <span className="text-3xl">{icon}</span>
      <span className={`mt-3 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagColors[tagColor]}`}>
        {tag}
      </span>
      <h3 className="mt-2 text-base font-semibold md:text-lg">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{body}</p>
    </div>
  );
}

function FeatureColumn({ title, icon, items }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">{title}</p>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <a href="#" className="text-xs text-muted-foreground transition hover:text-foreground">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}