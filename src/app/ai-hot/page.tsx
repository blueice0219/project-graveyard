import Link from "next/link";
import type { AiHotItem } from "@/types";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4";

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "未知时间";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN");
}

async function fetchAiHot(): Promise<AiHotItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(
      "https://aihot.virxact.com/api/public/items?mode=selected&take=20",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0",
        },
        next: { revalidate: 1800 },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export default async function AiHotPage() {
  const items = await fetchAiHot();

  return (
    <>
      {/* ===== Hero — 视频背景 ===== */}
      <section className="aihot-hero">
        {/* 背景视频 */}
        <video
          className="aihot-hero-video"
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* 渐变遮罩 */}
        <div className="aihot-hero-overlay" />

        {/* 内容 */}
        <div className="aihot-hero-content">
          <div className="flex items-center justify-center gap-2 mb-4 fade-in-up">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-eyebrow font-mono"
              style={{ color: "var(--accent)" }}
            >
              LIVE_FEED
            </span>
          </div>

          <h1
            className="fade-in-up"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              animationDelay: "0.05s",
            }}
          >
            AI HOT<span style={{ color: "var(--accent)" }}>.</span>
          </h1>

          <h2
            className="fade-in-up"
            style={{
              color: "var(--accent)",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 600,
              letterSpacing: "0.15em",
              marginTop: "12px",
              animationDelay: "0.1s",
            }}
          >
            AI 热点资讯
          </h2>

          <p
            className="mt-4 text-base leading-relaxed fade-in-up"
            style={{
              color: "var(--text-secondary)",
              maxWidth: "480px",
              margin: "16px auto 0",
              animationDelay: "0.15s",
            }}
          >
            AI 领域最新动态，每 30 分钟刷新
          </p>

          {/* 向下滚动指示器 */}
          <div className="mt-12 fade-in-up scroll-indicator" style={{ animationDelay: "0.3s" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)", margin: "0 auto" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== 资讯列表 ===== */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        {/* 章节标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-eyebrow font-mono"
              style={{ color: "var(--accent)" }}
            >
              LATEST
            </p>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              {items.length} 条资讯
            </span>
          </div>
          <div className="section-divider" />
        </div>

        {/* 资讯列表 — 竖向，编辑式排版 */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ color: "var(--text-muted)" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p
              className="mt-4 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              暂时无法获取资讯，请稍后再试
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {items.map((item, i) => (
              <ScrollReveal key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* 左侧：主体 */}
                    <div className="flex-1 min-w-0">
                      {/* 序号 + 分类 */}
                      <div className="flex items-center gap-3 mb-1.5">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.category && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              color: "var(--accent)",
                              background: "rgba(94, 234, 212, 0.08)",
                            }}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* 标题 */}
                      <h2
                        className="text-base font-medium leading-snug mb-2 transition-colors group-hover:text-accent"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </h2>

                      {/* 摘要 */}
                      {item.summary && (
                        <p
                          className="text-sm leading-relaxed mb-2 line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.summary}
                        </p>
                      )}

                      {/* 来源 + 时间 */}
                      <div
                        className="flex items-center gap-3 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span>{item.source}</span>
                        <span>·</span>
                        <span>{relativeTime(item.publishedAt)}</span>
                      </div>
                    </div>

                    {/* 右侧：箭头 */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
                      style={{ color: "var(--accent)" }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* 分割线 */}
        <div className="section-divider my-10" />

        {/* 底部 CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          ← 返回首页
        </Link>
      </div>
    </>
  );
}
