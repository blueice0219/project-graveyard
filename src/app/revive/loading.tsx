export default function ReviveLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-12">
      <div className="mb-10">
        <p
          className="text-eyebrow font-mono mb-2"
          style={{ color: "var(--accent)" }}
        >
          REVIVAL_SQUARE
        </p>
        <h1
          className="text-headline"
          style={{ color: "var(--text-primary)" }}
        >
          复活广场
        </h1>
      </div>

      <div className="section-divider mb-8" />

      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="py-6">
            <div
              className="h-6 rounded mb-4"
              style={{
                background: "var(--input-bg)",
                width: "30%",
              }}
            />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-baseline gap-3">
                  <span
                    className="text-xs font-mono shrink-0 w-20"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ▢▢▢▢
                  </span>
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
        ))}
      </div>
    </div>
  );
}
