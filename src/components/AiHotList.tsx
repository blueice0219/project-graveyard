"use client";

import { useState } from "react";
import type { AiHotItem } from "@/types";
import ScrollReveal from "@/components/ScrollReveal";

const PAGE_SIZE = 20;

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

export default function AiHotList({ items }: { items: AiHotItem[] }) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(PAGE_SIZE, items.length)
  );

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const remainingCount = items.length - visibleCount;

  return (
    <>
      {/* 资讯列表 */}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {visibleItems.map((item, i) => (
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

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + PAGE_SIZE, items.length)
              )
            }
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(94, 234, 212, 0.08)",
              color: "var(--accent)",
              border: "1px solid rgba(94, 234, 212, 0.2)",
            }}
          >
            加载更多 · 还有 {remainingCount} 条
          </button>
        </div>
      )}

      {/* 全部加载完提示 */}
      {!hasMore && items.length > PAGE_SIZE && (
        <div
          className="text-center mt-10 text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          已展示全部 {items.length} 条资讯
        </div>
      )}
    </>
  );
}
