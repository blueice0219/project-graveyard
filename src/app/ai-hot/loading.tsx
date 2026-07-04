export default function AiHotLoading() {
  return (
    <>
      {/* Hero 骨架 */}
      <section className="aihot-hero">
        <div className="aihot-hero-overlay" />
        <div className="aihot-hero-content">
          <div className="flex items-center justify-center gap-2 mb-4">
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
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            AI HOT<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <h2
            style={{
              color: "var(--accent)",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 600,
              letterSpacing: "0.15em",
              marginTop: "12px",
            }}
          >
            AI 热点资讯
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              margin: "16px auto 0",
              fontSize: "14px",
            }}
          >
            正在拉取最新资讯...
          </p>
        </div>
      </section>

      {/* 列表骨架 */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-eyebrow font-mono"
              style={{ color: "var(--accent)" }}
            >
              LATEST
            </span>
          </div>
          <div className="section-divider" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-5">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--input-bg)",
                    color: "var(--text-muted)",
                  }}
                >
                  ▢▢▢
                </span>
              </div>
              <div
                className="h-4 rounded mb-2"
                style={{
                  background: "var(--input-bg)",
                  width: `${70 + Math.random() * 20}%`,
                }}
              />
              <div
                className="h-3 rounded"
                style={{
                  background: "var(--input-bg)",
                  width: `${40 + Math.random() * 30}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
