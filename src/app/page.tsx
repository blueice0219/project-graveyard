import Link from "next/link";
import type { ProjectData } from "@/types";
import { getAllProjects } from "@/lib/db";
import BlackHoleButton from "@/components/BlackHoleButton";
import HeroVideo from "@/components/HeroVideo";
import ProjectGallery from "./_components/ProjectGallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = getAllProjects();

  const serialized: ProjectData[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    readme: p.readme,
    techStack: p.techStack,
    abandonReason: p.abandonReason,
    contactInfo: p.contactInfo,
    licenseType: p.licenseType,
    mindset: p.mindset,
    aiVision: p.aiVision,
    deathDiagnosis: p.deathDiagnosis,
    completionTier: p.completionTier,
    completionReason: p.completionReason,
    scoreBlockerType: p.scoreBlockerType,
    reusableAssets: p.reusableAssets,
    revivalDifficulty: p.revivalDifficulty,
    revivalReason: p.revivalReason,
    recommendedActions: p.recommendedActions,
    revivalPath: p.revivalPath,
    aiEpitaph: p.aiEpitaph,
    scoreClarity: p.scoreClarity,
    scoreReusability: p.scoreReusability,
    scoreDocLevel: p.scoreDocLevel,
    scoreUserValue: p.scoreUserValue,
    status: p.status,
    createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date(p.createdAt).toISOString(),
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : new Date(p.updatedAt).toISOString(),
  }));

  return (
    <>
      {/* ===== Hero — CodeNest full-screen style ===== */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden">
        {/* Background video (HLS) */}
        <HeroVideo />

        {/* Gradient overlay */}
        <div className="hero-gradient-overlay" />

        {/* Grid lines */}
        <div className="hero-grid-lines">
          <span style={{ left: "25%" }} />
          <span style={{ left: "50%" }} />
          <span style={{ left: "75%" }} />
        </div>

        {/* Central glow SVG */}
        <div className="hero-central-glow">
          <svg
            width="600"
            height="600"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.12" />
                <stop offset="40%" stopColor="#22c55e" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="300" cy="300" r="300" fill="url(#centralGlow)" />
          </svg>
        </div>

        {/* LEFT SIDE — Text content with staggered animations */}
        <div className="relative z-10 max-w-2xl flex-1 px-6 sm:px-12 md:px-20 lg:px-28 py-16 lg:py-0">
          {/* Eyebrow */}
          <p
            className="flex items-center gap-2 mb-4 fade-in-up"
            style={{
              color: "var(--accent)",
              fontSize: "11px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {/* Skull icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="10" r="8" />
              <line x1="10" y1="14" x2="10" y2="14.01" />
              <line x1="14" y1="14" x2="14" y2="14.01" />
              <path d="M8 18h8" />
              <path d="M7 21h10" />
              <line x1="9" y1="6" x2="9" y2="8" />
              <line x1="15" y1="6" x2="15" y2="8" />
            </svg>
            REST IN CODE
          </p>

          {/* Main headline */}
          <h1
            className="fade-in-up"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              animationDelay: "0.05s",
            }}
          >
            PROJECT GRAVEYARD<span className="green-period-glow">.</span>
          </h1>

          {/* Subtitle — Instrument Serif italic style */}
          <p
            className="mt-3 fade-in-up"
            style={{
              color: "var(--text-primary)",
              fontSize: "20px",
              fontStyle: "italic",
              fontFamily: "'Instrument Serif', serif",
              lineHeight: 1.4,
              animationDelay: "0.1s",
            }}
          >
            Where dead code goes to rest.
          </p>

          {/* 中文标题 */}
          <h2
            className="fade-in-up"
            style={{
              color: "var(--accent)",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 600,
              letterSpacing: "0.15em",
              marginTop: "16px",
              animationDelay: "0.12s",
            }}
          >
            项目墓园
          </h2>

          {/* Description */}
          <p
            className="mt-3 text-base leading-relaxed fade-in-up"
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              maxWidth: "512px",
              animationDelay: "0.15s",
            }}
          >
            让 AI 时代的烂尾项目被复活、拆件、展出或体面安葬
          </p>

          {/* CTA pill button */}
          <a
            href="#registry"
            className="cta-pill mt-8 inline-flex items-center gap-2 fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            浏览项目
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* RIGHT SIDE — BlackHoleButton (unchanged) */}
        <div
          className="flex-1 flex justify-center items-center fade-in-up relative z-10"
          style={{ animationDelay: "0.3s" }}
        >
          <BlackHoleButton />
        </div>

        {/* Scroll indicator at bottom-left */}
        <div className="absolute bottom-8 left-6 sm:left-12 md:left-20 lg:left-28 scroll-indicator hidden lg:block z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-eyebrow font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              scroll
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 -mt-4 relative z-10">
        <div className="stats-grid">
          <div className="flex flex-col items-center gap-1 py-6 px-4">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
            >
              42
            </span>
            <span
              className="text-xs font-mono uppercase"
              style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              已安葬
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 py-6 px-4">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
            >
              1,847
            </span>
            <span
              className="text-xs font-mono uppercase"
              style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              行代码
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 py-6 px-4">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
            >
              13
            </span>
            <span
              className="text-xs font-mono uppercase"
              style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              条教训
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 py-6 px-4">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
            >
              &infin;
            </span>
            <span
              className="text-xs font-mono uppercase"
              style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              新点子
            </span>
          </div>
        </div>
      </div>

      {/* ===== Section divider ===== */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="section-divider" />
      </div>

      {/* ===== Project Registry ===== */}
      <div id="registry" className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        <ProjectGallery projects={serialized} />
      </div>

      {/* ===== AI Hot Feed Link ===== */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 pb-20">
        <Link
          href="/ai-hot"
          className="group flex items-center justify-between py-5 border-t transition-all"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-eyebrow font-mono"
              style={{ color: "var(--text-secondary)" }}
            >
              AI_HOT_FEED
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              AI 热点资讯
            </span>
          </div>
          <span
            className="text-sm flex items-center gap-1.5 transition-all group-hover:gap-2.5"
            style={{ color: "var(--accent)" }}
          >
            查看全部
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </Link>
      </section>
    </>
  );
}
