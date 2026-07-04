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

      {/* 不规则矩形卡片 — CSS columns masonry 布局 */}
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
        <div className="masonry-grid">
          {filtered.map((p, index) => (
            <div key={p.id} className="masonry-item">
              <ProjectCard {...p} />
            </div>
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
