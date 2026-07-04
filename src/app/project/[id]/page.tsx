import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import ScrollReveal from "@/components/ScrollReveal";
import EpitaphDisplay from "@/components/EpitaphDisplay";
import TombstoneCard from "@/components/TombstoneCard";
import RevivalForm from "@/components/RevivalForm";
import DisassemblyKit from "@/components/DisassemblyKit";
import {
  BLOCKER_TYPES,
  COMPLETION_TIERS,
  REVIVAL_DIFFICULTY,
  CLARITY_LEVELS,
  REUSABILITY_LEVELS,
  DOC_LEVELS,
  USER_VALUE_LEVELS,
  RECOMMENDED_ACTIONS,
  PROJECT_STATUS,
  MINDSET_OPTIONS,
} from "@/types";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const tier = COMPLETION_TIERS[project.completionTier];
  const difficulty = REVIVAL_DIFFICULTY[project.revivalDifficulty];
  const blocker = BLOCKER_TYPES[project.scoreBlockerType];
  const statusInfo = PROJECT_STATUS[project.status];
  const mindsetInfo = MINDSET_OPTIONS[project.mindset];
  const clarityLabel = CLARITY_LEVELS[project.scoreClarity] ?? "未知";
  const reusability = REUSABILITY_LEVELS[project.scoreReusability];
  const docLabel = DOC_LEVELS[project.scoreDocLevel] ?? "未知";
  const userValue = USER_VALUE_LEVELS[project.scoreUserValue];

  const actions = project.recommendedActions
    .map((a) => ({ key: a, ...RECOMMENDED_ACTIONS[a] }))
    .filter((a) => a.label)
    .sort((a, b) => (a.priority || 99) - (b.priority || 99));

  const techList = project.techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-12">
      {/* 返回 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm transition-colors hover:text-accent"
        style={{ color: "var(--text-muted)" }}
      >
        ← 返回首页
      </Link>

      {/* 推荐处理方式标签 — 按优先级排序，第一项带 tagline */}
      {actions.length > 0 && (
        <ScrollReveal>
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              推荐
            </span>
            {actions.map((act, i) => (
              <span key={act.key} className="flex items-center gap-1.5">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {act.label}
                </span>
                {i === 0 && act.tagline && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {act.tagline}
                  </span>
                )}
                {i < actions.length - 1 ? (
                  <span style={{ color: "var(--text-muted)" }}>·</span>
                ) : null}
              </span>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* 项目头部 — 无卡片，纯排版 */}
      <ScrollReveal parallax={8}>
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-2">
            <h1
              className="text-headline"
              style={{ color: "var(--text-primary)" }}
            >
              {project.name}
            </h1>
            {statusInfo && (
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  color: statusInfo.color,
                  border: `1px solid ${statusInfo.color}40`,
                }}
              >
                {statusInfo.label}
              </span>
            )}
          </div>
          {mindsetInfo && (
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              心态：{mindsetInfo.label} — {mindsetInfo.desc}
            </p>
          )}
          <p
            className="mt-2 text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.description}
          </p>
          {techList.length > 0 && (
            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              {techList.join(" · ")}
            </p>
          )}
        </div>
      </ScrollReveal>

      {/* 分割线 */}
      <div className="section-divider my-10" />

      {/* 项目遗产卡 — 核心区域 */}
      <ScrollReveal parallax={-6}>
        <div>
          <h2
            className="text-eyebrow font-mono mb-6"
            style={{ color: "var(--accent)" }}
          >
            LEGACY_CARD
          </h2>

          {/* 一句话愿景 */}
          {project.aiVision && (
            <div className="mb-6">
              <Label>愿景</Label>
              <p
                className="text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {project.aiVision}
              </p>
            </div>
          )}

          {/* 墓志铭 — 醒目位置，斜体强调色 + 重新生成按钮 + 墓碑卡片下载 */}
          {project.aiEpitaph && (
            <>
              <EpitaphDisplay
                projectId={project.id}
                initialEpitaph={project.aiEpitaph}
              />
              <div className="mb-6">
                <TombstoneCard
                  projectName={project.name}
                  epitaph={project.aiEpitaph}
                  techStack={project.techStack}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                  projectId={project.id}
                />
              </div>
            </>
          )}

          {/* 死因诊断 */}
          {project.deathDiagnosis && (
            <div className="mb-6">
              <Label>死因诊断</Label>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {project.deathDiagnosis}
              </p>
            </div>
          )}

          {/* 完成度档位 + 复活评估 — 双列 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>完成度</Label>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: tier?.color }}
                >
                  {tier?.label ?? "未知"}
                </span>
              </div>
              {project.completionReason && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.completionReason}
                </p>
              )}
            </div>
            <div>
              <Label>复活评估</Label>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: difficulty?.color }}
                >
                  {difficulty?.label ?? "未知"}
                </span>
              </div>
              {project.revivalReason && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.revivalReason}
                </p>
              )}
            </div>
          </div>

          {/* 可复用资产清单 */}
          {project.reusableAssets.length > 0 && (
            <div className="mb-6" id="assets">
              <Label>可复用资产</Label>
              <div className="space-y-1">
                {project.reusableAssets.map((asset, i) => (
                  <div
                    key={i}
                    className="text-sm flex items-start gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span style={{ color: "var(--accent)" }}>·</span>
                    <span>{asset}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3天复活路径 — 仅当非空时显示，代码块风格 */}
          {project.revivalPath && (
            <div className="mb-6">
              <Label>3天复活路径</Label>
              <pre
                className="overflow-x-auto whitespace-pre-wrap rounded-md p-4 font-mono text-sm leading-relaxed"
                style={{
                  background: "var(--code-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                {project.revivalPath}
              </pre>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* 行动区块 — 遗产卡之后、辅助维度之前 */}
      {(project.recommendedActions.includes("disassemble") ||
        project.recommendedActions.includes("revive") ||
        project.status === "reviving") && (
        <ScrollReveal>
          <div>
            <h3
              className="text-eyebrow font-mono mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              ACTION
            </h3>

            {/* AI 拆件官 — 核心功能区 */}
            {project.recommendedActions.includes("disassemble") && (
              <div className="mb-8">
                <DisassemblyKit projectId={project.id} />
              </div>
            )}

            {/* 复活表单 / 复活中提示 */}
            {project.status === "reviving" ? (
              <p
                className="text-sm"
                style={{ color: "var(--status-green)" }}
              >
                该项目已有人认领复活中
              </p>
            ) : project.recommendedActions.includes("revive") ? (
              <RevivalForm projectId={project.id} />
            ) : null}
          </div>
        </ScrollReveal>
      )}

      {/* 分割线 */}
      <div className="section-divider my-10" />

      {/* 辅助维度 — 2列网格 */}
      <ScrollReveal parallax={4}>
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            辅助维度
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
            <Metric label="目标清晰度" value={clarityLabel} />
            <Metric
              label="阻塞点"
              value={blocker?.label ?? "未知"}
              dot={blocker?.dot}
            />
            <Metric label="可复用价值" value={reusability?.label ?? "未知"} />
            <Metric label="用户价值" value={userValue?.label ?? "未知"} />
            <Metric label="文档完整度" value={docLabel} />
          </div>
        </div>
      </ScrollReveal>

      {/* 分割线 */}
      <div className="section-divider my-10" />

      {/* 烂尾原因 / 联系方式 — 双列，无卡片 */}
      <ScrollReveal parallax={4}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              烂尾原因
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {project.abandonReason || "（未填写）"}
            </p>
          </div>
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              联系方式
            </h3>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {project.contactInfo || "（未填写）"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              协议: {project.licenseType}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* README — 无卡片，纯代码块 */}
      {project.readme && (
        <>
          <div className="section-divider my-10" />
          <ScrollReveal parallax={-8}>
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                README
              </h3>
              <pre
                className="overflow-x-auto whitespace-pre-wrap rounded-md p-4 font-mono text-sm leading-relaxed"
                style={{
                  background: "var(--code-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                {project.readme}
              </pre>
            </div>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-xs font-semibold uppercase tracking-widest mb-2"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </span>
  );
}

function Metric({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: string;
}) {
  return (
    <div
      className="flex items-baseline justify-between border-b pb-2"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span
        className="flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: dot }}
          />
        )}
        {value}
      </span>
    </div>
  );
}
