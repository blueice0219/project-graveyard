import Link from "next/link";

interface RevivalCase {
  name: string;
  deathCause: string;
  revivalPlan: string;
  status: string;
  reviver: string;
}

const CASES: RevivalCase[] = [
  {
    name: "MealMate",
    deathCause: "推荐算法质量差",
    revivalPlan: "RAG 架构重写",
    status: "已上线",
    reviver: "@dev_anon",
  },
  {
    name: "MoodLog",
    deathCause: "Prompt 工程不稳定",
    revivalPlan: "few-shot + 结构化输出",
    status: "内测中",
    reviver: "@solo_coder",
  },
  {
    name: "DevPort",
    deathCause: "设计能力不足",
    revivalPlan: "shadcn/ui 重做模板",
    status: "开发中",
    reviver: "@frontend_cat",
  },
];

export default function RevivePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-12">
      {/* 标题 */}
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
        <p
          className="mt-2 text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          那些从墓园中重生的项目
        </p>
      </div>

      {/* 分割线 */}
      <div className="section-divider mb-8" />

      {/* 案例列表 — 极简编辑式，无卡片 */}
      <div>
        {CASES.map((c, i) => (
          <div key={c.name}>
            <div className="py-6">
              {/* 项目名 */}
              <h2
                className="text-title mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {c.name}
              </h2>

              {/* 字段列表 — 标签 + 值，下划线分隔 */}
              <dl className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <dt
                    className="text-xs font-medium uppercase tracking-wider shrink-0 w-20 font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    原死因
                  </dt>
                  <dd
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.deathCause}
                  </dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt
                    className="text-xs font-medium uppercase tracking-wider shrink-0 w-20 font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    复活方案
                  </dt>
                  <dd
                    className="text-sm font-mono"
                    style={{ color: "var(--accent)" }}
                  >
                    {c.revivalPlan}
                  </dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt
                    className="text-xs font-medium uppercase tracking-wider shrink-0 w-20 font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    状态
                  </dt>
                  <dd
                    className="text-sm font-medium"
                    style={{ color: "var(--status-green)" }}
                  >
                    {c.status}
                  </dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt
                    className="text-xs font-medium uppercase tracking-wider shrink-0 w-20 font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    复活者
                  </dt>
                  <dd
                    className="text-sm font-mono"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.reviver}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 案例间分割线 */}
            {i < CASES.length - 1 && (
              <div className="section-divider" />
            )}
          </div>
        ))}
      </div>

      {/* 分割线 */}
      <div className="section-divider my-10" />

      {/* 底部 CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: "var(--accent)" }}
      >
        你的项目也可以复活 →
      </Link>
    </div>
  );
}
