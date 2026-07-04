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
  abandonReason?: string;
  reusableAssets?: string[];
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
  abandonReason,
  reusableAssets,
}: ProjectCardProps) {
  const techList = techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  const blocker = BLOCKER_TYPES[scoreBlockerType];
  const tier = COMPLETION_TIERS[completionTier];
  const statusInfo = PROJECT_STATUS[status];

  // 根据 id 的字符和确定一个 0-3 的变体，让卡片呈现不规则高度
  const variant = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 4;
  const showAbandonReason = variant === 0 || variant === 2;
  const showReusableAssets = (variant === 1 || variant === 3) && reusableAssets && reusableAssets.length > 0;
  const showEpitaph = variant !== 3 || aiEpitaph.length > 20;
  const showDescription = variant !== 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/project/${id}`} className="group block">
        <div className="grave-card p-5 relative h-full">
          {/* Status badge — absolute top-right */}
          {statusInfo && (
            <span
              className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full z-10"
              style={{
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}40`,
                background: "var(--bg-primary)",
              }}
            >
              {statusInfo.label}
            </span>
          )}

          {/* Top row: R.I.P. + date badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xl italic tracking-wide"
              style={{
                color: "var(--text-muted)",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              R.I.P.
            </span>
            <span
              className="text-[11px] font-mono px-2.5 py-0.5 rounded-full"
              style={{
                color: "var(--accent)",
                background: "var(--accent-glow)",
              }}
            >
              {new Date(createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Icon row: code icon + name + tech stack */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon container — 40x40 glass */}
            <div
              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid var(--border)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--accent)" }}
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              {/* Project name */}
              <h3
                className="text-base font-semibold tracking-tight leading-tight transition-colors group-hover:text-accent"
                style={{ color: "var(--text-primary)" }}
              >
                {name}
              </h3>

              {/* Tech stack — mono font under name */}
              {techList.length > 0 && (
                <p
                  className="text-[11px] font-mono mt-1 leading-tight"
                  style={{ color: "var(--text-muted)" }}
                >
                  {techList.join(" · ")}
                </p>
              )}
            </div>
          </div>

          {/* Epitaph — accent italic (根据变体决定是否显示) */}
          {showEpitaph && aiEpitaph && (
            <p
              className="text-sm italic mb-2.5 leading-relaxed"
              style={{ color: "var(--accent)", opacity: 0.85 }}
            >
              &ldquo;{aiEpitaph}&rdquo;
            </p>
          )}

          {/* Description (根据变体决定是否显示) */}
          {showDescription && description && (
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {description}
            </p>
          )}

          {/* Completion tier + blocker inline */}
          <div className="flex items-center gap-2 text-xs mb-3 flex-wrap">
            {tier && (
              <span
                className="font-mono px-2 py-0.5 rounded"
                style={{
                  color: tier.color,
                  background: `${tier.color}12`,
                }}
              >
                {tier.label}
              </span>
            )}
            {blocker && (
              <span
                className="inline-flex items-center gap-1.5 font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: blocker.dot }}
                />
                {blocker.label}
              </span>
            )}
          </div>

          {/* Cause of death section — glass panel (根据变体决定) */}
          {showAbandonReason && abandonReason && (
            <div
              className="rounded-lg px-3.5 py-2.5 text-xs leading-relaxed mb-3"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--text-muted)" }}
                >
                  <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
                <span
                  className="font-mono text-[10px] tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  CAUSE OF DEATH
                </span>
              </div>
              <span style={{ color: "var(--text-secondary)" }}>
                {abandonReason}
              </span>
            </div>
          )}

          {/* Reusable assets — 根据变体显示 */}
          {showReusableAssets && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--text-muted)" }}
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <span
                  className="font-mono text-[10px] tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  REUSABLE ASSETS
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reusableAssets!.slice(0, 4).map((asset, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{
                      color: "var(--accent)",
                      background: "var(--accent-glow)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hover arrow — bottom-right */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0"
            style={{ color: "var(--accent)" }}
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
