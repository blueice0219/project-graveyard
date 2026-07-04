# UI Design Backup v1

Generated: 2026-07-04

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/app/globals.css
   ═══════════════════════════════════════════════ -->

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================================
   PROJECT GRAVEYARD — DESIGN SYSTEM v2.0
   深空墓园 · 翡翠青绿墓志铭
   字体: Inter (display+body) + JetBrains Mono (code+numbers)
   保留: 黑洞动画 · 3D粒子 · 玻璃拟态 · teal签名色
   ============================================================ */

/* ===== 夜间模式（默认）===== */
:root {
  /* — 画布层级 — */
  --bg-primary: #08090d;
  --bg-secondary: #0e1015;
  --bg-tertiary: #14171d;
  --bg-elevated: #1a1d24;

  /* — 边框 — */
  --border: rgba(94, 234, 212, 0.10);
  --border-hover: rgba(94, 234, 212, 0.30);
  --border-strong: rgba(94, 234, 212, 0.20);

  /* — 文字层级 — */
  --text-primary: #e8eaed;
  --text-secondary: #9ca3af;
  --text-muted: #565d6b;
  --text-inverse: #08090d;

  /* — 签名强调色（保留 teal）— */
  --accent: #5EEAD4;
  --accent-bright: #7FF5E0;
  --accent-dim: #2DD4BF;
  --accent-glow: rgba(94, 234, 212, 0.15);

  /* — 玻璃拟态（保留）— */
  --glass-bg: rgba(14, 16, 21, 0.65);
  --glass-blur: 16px;
  --glass-border: 1px solid rgba(94, 234, 212, 0.10);
  --glass-glow: 0 0 20px rgba(94, 234, 212, 0.06);
  --glass-hover-glow: 0 0 30px rgba(94, 234, 212, 0.12);

  /* — 输入 — */
  --input-bg: rgba(94, 234, 212, 0.03);
  --code-bg: #0e1015;

  /* — 粒子（保留）— */
  --particle-1: #5EEAD4;
  --particle-2: #2DD4BF;
  --particle-3: #7FF5E0;

  /* — 语义色 — */
  --status-red: #F87171;
  --status-yellow: #FBBF24;
  --status-green: #34D399;

  /* — 字体变量（由 next/font 注入）— */
  --font-inter: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --font-mono: var(--font-mono), 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

  /* — 间距精度系统 — */
  --space-xxs: 2px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;
  --space-4xl: 40px;
  --space-5xl: 48px;
  --space-6xl: 64px;
  --space-section: 96px;

  /* — 圆角 — */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;

  /* — 排版层级 — */
  --text-display: 60px;
  --text-display-lh: 1.05;
  --text-display-ls: -0.04em;
  --text-display-w: 600;

  --text-headline: 36px;
  --text-headline-lh: 1.15;
  --text-headline-ls: -0.02em;
  --text-headline-w: 600;

  --text-title: 24px;
  --text-title-lh: 1.25;
  --text-title-ls: -0.01em;
  --text-title-w: 600;

  --text-subhead: 20px;
  --text-subhead-lh: 1.4;
  --text-subhead-ls: 0;
  --text-subhead-w: 500;

  --text-body-lg: 18px;
  --text-body-lg-lh: 1.6;

  --text-body: 16px;
  --text-body-lh: 1.6;

  --text-body-sm: 14px;
  --text-body-sm-lh: 1.5;

  --text-caption: 12px;
  --text-caption-lh: 1.4;

  --text-eyebrow: 13px;
  --text-eyebrow-ls: 0.08em;
  --text-eyebrow-w: 600;
}

/* ===== 日间模式 ===== */
html.light {
  --bg-primary: #f7f8fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #eef0f4;
  --bg-elevated: #e4e7ec;

  --border: rgba(45, 212, 191, 0.18);
  --border-hover: rgba(45, 212, 191, 0.40);
  --border-strong: rgba(45, 212, 191, 0.28);

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;

  --accent: #0d9488;
  --accent-bright: #0f766e;
  --accent-dim: #14b8a6;
  --accent-glow: rgba(13, 148, 136, 0.10);

  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: 1px solid rgba(45, 212, 191, 0.18);
  --glass-glow: 0 0 20px rgba(20, 184, 166, 0.04);
  --glass-hover-glow: 0 0 30px rgba(20, 184, 166, 0.08);

  --input-bg: rgba(45, 212, 191, 0.03);
  --code-bg: #f0f4f8;

  --particle-1: #14B8A6;
  --particle-2: #2DD4BF;
  --particle-3: #5EEAD4;

  --status-red: #DC2626;
  --status-yellow: #D97706;
  --status-green: #059669;
}

/* ===== 基础 ===== */
* {
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: var(--font-inter);
  transition: background 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* ===== 滚动条 ===== */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: var(--radius-pill);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-dim);
}

/* ===== 选中文本 ===== */
::selection {
  background: var(--accent);
  color: var(--text-inverse);
}

/* ===== 玻璃拟态工具类（保留）===== */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent),
    transparent
  );
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.glass-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--glass-hover-glow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-card:hover::before {
  opacity: 1;
}

.glass-input {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.glass-input:focus {
  border-color: var(--border-hover);
  box-shadow: 0 0 12px var(--accent-glow);
  outline: none;
}

.glass-input::placeholder {
  color: var(--text-muted);
}

/* ===== 排版工具类 ===== */
.font-mono {
  font-family: var(--font-mono);
}

.text-eyebrow {
  font-size: var(--text-eyebrow);
  font-weight: var(--text-eyebrow-w);
  letter-spacing: var(--text-eyebrow-ls);
  text-transform: uppercase;
}

.text-display {
  font-size: var(--text-display);
  font-weight: var(--text-display-w);
  line-height: var(--text-display-lh);
  letter-spacing: var(--text-display-ls);
}

.text-headline {
  font-size: var(--text-headline);
  font-weight: var(--text-headline-w);
  line-height: var(--text-headline-lh);
  letter-spacing: var(--text-headline-ls);
}

.text-title {
  font-size: var(--text-title);
  font-weight: var(--text-title-w);
  line-height: var(--text-title-lh);
  letter-spacing: var(--text-title-ls);
}

/* ===== 章节分隔线 — 精密渐变 ===== */
.section-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--border-strong) 20%,
    var(--border-strong) 80%,
    transparent 100%
  );
}

/* ===== 动画（保留全部）===== */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.pulse-dot {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
.scroll-indicator {
  animation: bounce-arrow 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin-loading {
  animation: spin 0.8s linear infinite;
}

/* ===== 链接 ===== */
a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  color: var(--accent-bright);
}

/* ===== 发光进度条 ===== */
.glow-bar {
  box-shadow: 0 0 8px rgba(94, 234, 212, 0.5);
}

/* 主题切换过渡 */
.theme-transition * {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* ===== 黑洞动画（保留全部，不修改）===== */
@keyframes bh-rotate {
  to { transform: rotate(360deg); }
}

@keyframes bh-rotate-reverse {
  to { transform: rotate(-360deg); }
}

@keyframes bh-glow-pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.04); }
}

@keyframes bh-ring-pulse {
  0%, 100% {
    box-shadow: 0 0 25px var(--accent), 0 0 50px rgba(94, 234, 212, 0.2), inset 0 0 15px rgba(94, 234, 212, 0.12);
  }
  50% {
    box-shadow: 0 0 40px var(--accent), 0 0 80px rgba(94, 234, 212, 0.4), inset 0 0 25px rgba(94, 234, 212, 0.3);
  }
}

/* 黑洞中的玻璃拟态上传按钮 */
.bh-button {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 38px;
  padding: 14px 28px;
  transition: all 0.2s cubic-bezier(.2, .8, .2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.bh-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
  box-shadow: 0 8px 32px rgba(94, 234, 212, 0.3), 0 0 20px rgba(94, 234, 212, 0.2);
}

.bh-button:active {
  transform: scale(0.97);
}

/* 光标粒子轨道旋转 */
@keyframes cursor-orbit {
  to { transform: rotate(360deg); }
}
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/app/page.tsx
   ═══════════════════════════════════════════════ -->

```tsx
import Link from "next/link";
import type { ProjectData } from "@/types";
import { getAllProjects } from "@/lib/db";
import BlackHoleButton from "@/components/BlackHoleButton";
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
      {/* ===== Hero — 双栏：左侧文字 + 右侧黑洞（黑洞动画不动）===== */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row items-center justify-between gap-8 px-6 sm:px-12 md:px-20 lg:px-28 py-12">
        <div className="max-w-2xl flex-1">
          {/* 眉标 */}
          <p
            className="text-eyebrow fade-in-up mb-4"
            style={{ color: "var(--accent)" }}
          >
            VIBE CODER · PROJECT CEMETERY
          </p>

          {/* 品牌名 — display 层级 */}
          <h1
            className="text-display fade-in-up"
            style={{
              color: "var(--text-primary)",
            }}
          >
            PROJECT
            <br />
            GRAVEYARD
          </h1>

          {/* 副标题 */}
          <p
            className="mt-4 text-xl font-medium fade-in-up font-mono"
            style={{ color: "var(--accent)", animationDelay: "0.1s" }}
          >
            项目墓园
          </p>

          {/* 描述 */}
          <p
            className="mt-3 text-base max-w-md leading-relaxed fade-in-up"
            style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}
          >
            让 AI 时代的烂尾项目被复活、拆件、展出或体面安葬
          </p>

          {/* 单一 CTA */}
          <a
            href="#registry"
            className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg fade-in-up"
            style={{
              background: "var(--accent)",
              color: "var(--bg-primary)",
              animationDelay: "0.3s",
            }}
          >
            浏览项目
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* 右侧：黑洞动画 + 上传按钮（不动）*/}
        <div
          className="flex-1 flex justify-center items-center fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <BlackHoleButton />
        </div>

        {/* 滚动指示器 */}
        <div className="absolute bottom-8 left-6 sm:left-12 md:left-20 lg:left-28 scroll-indicator hidden lg:block">
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

      {/* ===== 章节分隔线 ===== */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16">
        <div className="section-divider" />
      </div>

      {/* ===== 项目登记册 ===== */}
      <div id="registry" className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        <ProjectGallery projects={serialized} />
      </div>

      {/* ===== AI 热点资讯 — 简洁入口 ===== */}
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
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/app/layout.tsx
   ═══════════════════════════════════════════════ -->

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import SceneBackground from "@/components/SceneBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Graveyard / 项目墓园",
  description: "Vibe Coder 的烂尾项目开源认领社区 — 让 AI 时代的半成品项目被复活、拆件、展出或体面安葬",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SceneBackground />
          <Header />
          <main className="relative z-10">
            {children}
          </main>
          <footer className="relative z-10 mt-20">
            <div className="max-w-6xl mx-auto px-6 py-10">
              <div
                className="flex flex-col items-center gap-3 text-center"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="pt-6">
                  <span
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Project Graveyard
                  </span>
                  <span
                    className="ml-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    项目墓园
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed max-w-md"
                  style={{ color: "var(--text-muted)" }}
                >
                  让每个半成品项目都有机会被复活、拆件、合并、展出或体面安葬
                </p>
                <p
                  className="text-xs font-mono opacity-50"
                  style={{ color: "var(--text-muted)" }}
                >
                  Powered by TRAE &amp; 火山引擎
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/components/Header.tsx
   ═══════════════════════════════════════════════ -->

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/upload", label: "上传项目" },
  { href: "/revive", label: "复活广场" },
  { href: "/ai-hot", label: "AI 资讯" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* 底部精密渐变线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)",
          opacity: 0.25,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 左侧 Logo — mono 字体技术感 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* 简约几何标记 */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--accent)",
                borderWidth: "1.5px",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-sm font-semibold tracking-tight font-mono"
              style={{ color: "var(--text-primary)" }}
            >
              PROJECT_GRAVEYARD
            </span>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: "var(--text-muted)" }}
            >
              项目墓园
            </span>
          </div>
        </Link>

        {/* 右侧导航 */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 text-sm transition-colors"
                style={{
                  color: isActive
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                }}
              >
                {link.label}
                {/* 活动指示器 */}
                {isActive && (
                  <span
                    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 0 6px var(--accent)",
                    }}
                  />
                )}
              </Link>
            );
          })}
          <div
            className="w-px h-4 mx-2"
            style={{ background: "var(--border)" }}
          />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/components/ProjectCard.tsx
   ═══════════════════════════════════════════════ -->

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BLOCKER_TYPES, COMPLETION_TIERS, PROJECT_STATUS } from "@/types";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  techStack: string;
  completionTier: string;
  scoreBlockerType: string;
  aiEpitaph: string;
  status: string;
  createdAt: string;
}

export default function ProjectCard({
  id,
  name,
  description,
  techStack,
  completionTier,
  scoreBlockerType,
  aiEpitaph,
  status,
  createdAt,
}: ProjectCardProps) {
  const techList = techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  const blocker = BLOCKER_TYPES[scoreBlockerType];
  const tier = COMPLETION_TIERS[completionTier];
  const statusInfo = PROJECT_STATUS[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/project/${id}`} className="group block">
        <div
          className="relative py-5 px-4 -mx-4 rounded-lg transition-all duration-300"
          style={{
            borderLeft: "2px solid transparent",
          }}
        >
          {/* hover 时的左侧光线和背景 */}
          <div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "rgba(94, 234, 212, 0.03)",
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 group-hover:h-full transition-all duration-300"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}
          />

          <div className="relative flex items-start justify-between gap-6">
            {/* 左侧：主体信息 */}
            <div className="flex-1 min-w-0">
              {/* 项目名称 + 完成度档位 */}
              <div className="flex items-baseline gap-3 mb-1">
                <h3
                  className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent"
                  style={{ color: "var(--text-primary)" }}
                >
                  {name}
                </h3>
                {tier && (
                  <span
                    className="text-xs font-mono"
                    style={{ color: tier.color }}
                  >
                    {tier.label}
                  </span>
                )}
              </div>

              {/* 墓志铭 */}
              {aiEpitaph && (
                <p
                  className="text-sm italic mb-2 leading-relaxed"
                  style={{ color: "var(--accent)", opacity: 0.8 }}
                >
                  {aiEpitaph}
                </p>
              )}

              {/* 描述 */}
              {description && (
                <p
                  className="text-sm leading-relaxed line-clamp-1 mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {description}
                </p>
              )}

              {/* 技术栈 + 阻塞点 — inline */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span
                  className="font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {techList.join(" · ")}
                </span>
                {blocker && (
                  <>
                    <span style={{ color: "var(--text-muted)" }}>·</span>
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: blocker.dot }}
                      />
                      {blocker.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 右侧：状态徽章 + 日期 + 箭头 */}
            <div className="shrink-0 flex flex-col items-end gap-2 pt-1">
              {statusInfo && (
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{
                    color: statusInfo.color,
                    border: `1px solid ${statusInfo.color}40`,
                  }}
                >
                  {statusInfo.label}
                </span>
              )}
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                {new Date(createdAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                style={{ color: "var(--accent)" }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: src/app/_components/ProjectGallery.tsx
   ═══════════════════════════════════════════════ -->

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/types";

const TECH_OPTIONS = ["全部", "React", "Vue", "Python", "Flutter", "Next.js"];

const BLOCKER_OPTIONS: { value: string; label: string }[] = [
  { value: "全部", label: "全部" },
  { value: "tech", label: "技术" },
  { value: "design", label: "设计" },
  { value: "product", label: "产品" },
  { value: "resource", label: "资源" },
  { value: "motivation", label: "动力" },
];

export default function ProjectGallery({
  projects,
}: {
  projects: ProjectData[];
}) {
  const [keyword, setKeyword] = useState("");
  const [tech, setTech] = useState("全部");
  const [blocker, setBlocker] = useState("全部");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return projects.filter((p) => {
      const matchKeyword =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.toLowerCase().includes(q);
      const matchTech =
        tech === "全部" ||
        p.techStack.toLowerCase().includes(tech.toLowerCase());
      const matchBlocker =
        blocker === "全部" || p.scoreBlockerType === blocker;
      return matchKeyword && matchTech && matchBlocker;
    });
  }, [projects, keyword, tech, blocker]);

  return (
    <section className="space-y-8">
      {/* 章节标题 — eyebrow + headline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-eyebrow font-mono"
            style={{ color: "var(--accent)" }}
          >
            REGISTRY
          </p>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {filtered.length} / {projects.length}
          </span>
        </div>
        <h2
          className="text-headline"
          style={{ color: "var(--text-primary)" }}
        >
          项目登记册
        </h2>
      </div>

      {/* 搜索 + 筛选 — 极简 inline */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:flex-1 relative">
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "var(--text-muted)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索项目..."
            className="w-full bg-transparent border-0 border-b pl-5 pr-3 py-2 text-sm transition-colors focus:outline-none"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="bg-transparent border-0 border-b px-1 py-2 text-xs transition-colors focus:outline-none cursor-pointer font-mono"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {TECH_OPTIONS.map((t) => (
              <option key={t} value={t} style={{ background: "var(--bg-secondary)" }}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={blocker}
            onChange={(e) => setBlocker(e.target.value)}
            className="bg-transparent border-0 border-b px-1 py-2 text-xs transition-colors focus:outline-none cursor-pointer font-mono"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {BLOCKER_OPTIONS.map((b) => (
              <option key={b.value} value={b.value} style={{ background: "var(--bg-secondary)" }}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 列表 / 空状态 */}
      {projects.length === 0 ? (
        <EmptyState
          title="墓园里还很安静"
          desc="还没有项目被安葬在这里。去上传你的第一个烂尾项目，让 AI 为它写一份验尸报告吧。"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="没有匹配的项目"
          desc="试试调整搜索关键词，或切换筛选条件。"
        />
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--text-muted)" }}
      >
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
      </svg>
      <h3
        className="mt-4 text-title"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 max-w-md text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {desc}
      </p>
      <Link
        href="/upload"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "var(--accent)" }}
      >
        上传项目 →
      </Link>
    </div>
  );
}
```

---

<!-- ═══════════════════════════════════════════════
   BACKUP: tailwind.config.ts
   ═══════════════════════════════════════════════ -->

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          bright: "var(--accent-bright)",
          dim: "var(--accent-dim)",
        },
        status: {
          red: "var(--status-red)",
          yellow: "var(--status-yellow)",
          green: "var(--status-green)",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['var(--font-mono)', '"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backdropBlur: {
        glass: "16px",
        header: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
```
