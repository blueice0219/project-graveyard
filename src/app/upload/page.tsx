"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MINDSET_OPTIONS } from "@/types";

const LICENSE_OPTIONS = ["MIT", "Apache-2.0", "GPL-3.0", "CC0", "自定义"];
const MINDSET_ENTRIES = Object.entries(MINDSET_OPTIONS);

const AI_ASSIST_PROMPT = `帮我整理一个烂尾项目的信息，方便我提交到「项目墓园」网站。

请根据我提供的信息（项目目录、README、或口述），帮我整理出以下字段，用 === 分隔每个字段，方便我直接复制粘贴：

1. 项目名称（简短，一句话能记住的名字）
2. 一句话描述（这个项目想解决什么问题，不超过 30 字）
3. 技术栈（逗号分隔，列出主要技术）
4. 烂尾原因（为什么卡住了？真实原因，不用美化，2-3 句话）
5. README（把项目的 README 原文贴过来，如果没有就写"无"）

输出格式如下：
=== 项目名称 ===
（在这里）
=== 一句话描述 ===
（在这里）
=== 技术栈 ===
（在这里）
=== 烂尾原因 ===
（在这里）
=== README ===
（在这里）

注意：
- 烂尾原因要说真话，比如"做着做着没兴趣了""技术选型踩坑了""功能太多做不完"都行
- 如果我给了项目目录，帮我从 README.md 或 package.json 里提取信息
- 技术栈只列实际用到的，不要列计划用的`;

interface UploadForm {
  name: string;
  description: string;
  techStack: string;
  abandonReason: string;
  readme: string;
  contactInfo: string;
  licenseType: string;
  mindset: string;
}

const initialForm: UploadForm = {
  name: "",
  description: "",
  techStack: "",
  abandonReason: "",
  readme: "",
  contactInfo: "",
  licenseType: "MIT",
  mindset: "give-up",
};

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState<UploadForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  const [promptExpanded, setPromptExpanded] = useState(false);

  const update = (key: keyof UploadForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(AI_ASSIST_PROMPT);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      // 兜底：创建 textarea 手动复制
      const textarea = document.createElement("textarea");
      textarea.value = AI_ASSIST_PROMPT;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
      } catch {
        setError("复制失败，请手动选中文本复制");
      }
      document.body.removeChild(textarea);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `提交失败（HTTP ${res.status}）`);
      }

      const data = (await res.json()) as { id: string };
      router.push(`/project/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b px-0 py-2.5 text-sm transition-colors focus:outline-none focus:border-accent";
  const labelClass =
    "block text-xs font-medium uppercase tracking-wider mb-2 font-mono";

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-12 md:px-16 py-12">
      {/* 标题 */}
      <div className="mb-10">
        <p
          className="text-eyebrow font-mono mb-2"
          style={{ color: "var(--accent)" }}
        >
          NEW_ENTRY
        </p>
        <h1
          className="text-headline"
          style={{ color: "var(--text-primary)" }}
        >
          安葬一个项目
        </h1>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          填写项目信息，提交后将由 AI 验尸官生成评分报告与墓志铭。
        </p>
      </div>

      {/* AI 整理助手 — 可折叠提示词 */}
      <div
        className="mb-8 rounded-lg border overflow-hidden transition-all"
        style={{
          borderColor: "var(--border)",
          background: "var(--input-bg)",
        }}
      >
        {/* 折叠条 */}
        <button
          type="button"
          onClick={() => setPromptExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--accent)" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              不知道怎么填？让 AI 帮你整理
            </span>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform"
            style={{
              color: "var(--text-muted)",
              transform: promptExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* 展开内容 */}
        {promptExpanded && (
          <div className="px-4 pb-4">
            <p
              className="text-xs mb-3 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              把这段提示词复制给你的 AI 助手（Claude / ChatGPT / Trae
              等），告诉它你的项目目录或贴上 README，它就会帮你整理好下面所有字段。
            </p>

            {/* 提示词预览 */}
            <pre
              className="text-xs leading-relaxed rounded-md p-3 mb-3 overflow-x-auto font-mono whitespace-pre-wrap"
              style={{
                background: "var(--code-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {AI_ASSIST_PROMPT}
            </pre>

            {/* 复制按钮 */}
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: promptCopied
                  ? "var(--status-green)"
                  : "var(--accent)",
                color: "var(--bg-primary)",
              }}
            >
              {promptCopied ? (
                <>
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  已复制，去粘贴给 AI
                </>
              ) : (
                <>
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
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  一键复制提示词
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 表单分隔线 */}
      <div className="section-divider mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 当前心态 */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }}>
            MINDSET / 当前心态 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MINDSET_ENTRIES.map(([key, opt]) => (
              <button
                key={key}
                type="button"
                onClick={() => update("mindset", key)}
                className="text-left p-3 rounded-lg border transition-all"
                style={{
                  borderColor: form.mindset === key ? "var(--accent)" : "var(--border)",
                  background: form.mindset === key ? "var(--accent-glow)" : "transparent",
                }}
              >
                <span
                  className="text-sm font-medium block"
                  style={{ color: "var(--text-primary)" }}
                >
                  {opt.label}
                </span>
                <span
                  className="text-xs mt-1 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 项目名称 */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="name">
            PROJECT_NAME / 项目名称 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="例如：今天吃什么推荐器"
            className={inputClass}
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        {/* 一句话描述 */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="description">
            DESCRIPTION / 一句话描述 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="description"
            type="text"
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="用一句话说清这个项目想做什么"
            className={inputClass}
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        {/* 技术栈 */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="techStack">
            TECH_STACK / 技术栈 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="techStack"
            type="text"
            required
            value={form.techStack}
            onChange={(e) => update("techStack", e.target.value)}
            placeholder="逗号分隔，例如：React, Next.js, TailwindCSS"
            className={`${inputClass} font-mono`}
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        {/* 烂尾原因 */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="abandonReason">
            ABANDON_REASON / 烂尾原因 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <textarea
            id="abandonReason"
            required
            rows={3}
            value={form.abandonReason}
            onChange={(e) => update("abandonReason", e.target.value)}
            placeholder="为什么会烂尾？卡在哪里了？"
            className={`${inputClass} resize-y`}
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        {/* README */}
        <div>
          <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="readme">
            README <span style={{ color: "var(--text-muted)" }}>(选填)</span>
          </label>
          <textarea
            id="readme"
            rows={5}
            value={form.readme}
            onChange={(e) => update("readme", e.target.value)}
            placeholder="粘贴项目的 README"
            className={`${inputClass} resize-y font-mono text-xs`}
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>

        {/* 联系方式 + 协议 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="contactInfo">
              CONTACT / 联系方式 <span style={{ color: "var(--text-muted)" }}>(选填)</span>
            </label>
            <input
              id="contactInfo"
              type="text"
              value={form.contactInfo}
              onChange={(e) => update("contactInfo", e.target.value)}
              placeholder="GitHub 用户名或邮箱"
              className={inputClass}
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--text-secondary)" }} htmlFor="licenseType">
              LICENSE / 开源协议
            </label>
            <select
              id="licenseType"
              value={form.licenseType}
              onChange={(e) => update("licenseType", e.target.value)}
              className={`${inputClass} cursor-pointer font-mono`}
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              {LICENSE_OPTIONS.map((l) => (
                <option key={l} value={l} style={{ background: "var(--bg-secondary)" }}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 表单分隔线 */}
        <div className="section-divider pt-2" />

        {/* 错误提示 */}
        {error && (
          <p className="text-sm" style={{ color: "var(--status-red)" }}>
            {error}
          </p>
        )}

        {/* 操作区 */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--accent)",
              color: "var(--bg-primary)",
            }}
          >
            {loading && (
              <svg
                className="spin-loading"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {loading ? "生成中..." : "提交并生成 AI 验尸报告"}
          </button>
          <Link
            href="/"
            className="text-sm transition-colors hover:text-text-primary"
            style={{ color: "var(--text-muted)" }}
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
