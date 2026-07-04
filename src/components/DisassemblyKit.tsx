"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DISASSEMBLY_TYPE_LABELS,
  type DisassemblyKit as DisassemblyKitType,
  type DisassemblyType,
} from "@/types";

interface DisassemblyKitProps {
  projectId: string;
}

type LoadingState = "idle" | "loading" | "done" | "error";

export default function DisassemblyKit({ projectId }: DisassemblyKitProps) {
  const [state, setState] = useState<LoadingState>("idle");
  const [kit, setKit] = useState<DisassemblyKitType | null>(null);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState<DisassemblyType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDisassemble = useCallback(async () => {
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/disassemble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error || `拆件失败（HTTP ${res.status}）`);
      }

      const data = (await res.json()) as DisassemblyKitType;
      setKit(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "拆件失败，请稍后重试");
      setState("error");
    }
  }, [projectId]);

  const handleCopy = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // execCommand fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        // ignore
      }
      document.body.removeChild(textarea);
    }
  }, []);

  const handleDownload = useCallback((filename: string, code: string) => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // ─── idle: 展示拆件入口 ───────────────────────────────
  if (state === "idle") {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{
          borderColor: "var(--border)",
          background: "var(--input-bg)",
        }}
      >
        <div className="mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
            style={{ color: "var(--accent)" }}
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h3
          className="text-title mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          AI 拆件官
        </h3>
        <p
          className="text-sm leading-relaxed max-w-md mx-auto mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          让 AI 把这个项目的尸体拆成一盒还能用的器官——组件代码、Prompt
          文件、设计 Token、数据结构，每个都可一键带走。
        </p>
        <button
          onClick={handleDisassemble}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg"
          style={{
            background: "var(--accent)",
            color: "var(--bg-primary)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          </svg>
          开始拆件
        </button>
      </div>
    );
  }

  // ─── loading ──────────────────────────────────────────
  if (state === "loading") {
    return (
      <div
        className="rounded-lg border p-8"
        style={{
          borderColor: "var(--border)",
          background: "var(--input-bg)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="spin-loading"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ color: "var(--accent)" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            AI 拆件官正在解剖...
          </span>
        </div>

        {/* 骨架屏 */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div
                className="h-5 rounded mb-2"
                style={{
                  background: "var(--border)",
                  width: `${30 + i * 10}%`,
                }}
              />
              <div
                className="h-32 rounded-lg"
                style={{ background: "var(--border)" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── error ────────────────────────────────────────────
  if (state === "error") {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{
          borderColor: "var(--status-red)",
          background: "rgba(248, 113, 113, 0.05)",
        }}
      >
        <p
          className="text-sm mb-4"
          style={{ color: "var(--status-red)" }}
        >
          {error}
        </p>
        <button
          onClick={handleDisassemble}
          className="text-sm font-medium"
          style={{ color: "var(--accent)" }}
        >
          重试 →
        </button>
      </div>
    );
  }

  // ─── done: 展示拆件结果 ────────────────────────────────
  if (!kit) return null;

  const types = Array.from(new Set(kit.items.map((item) => item.type)));
  const filteredItems =
    activeType === "all"
      ? kit.items
      : kit.items.filter((item) => item.type === activeType);

  return (
    <div>
      {/* 拆件总结 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-eyebrow font-mono"
            style={{ color: "var(--accent)" }}
          >
            DISASSEMBLY_KIT
          </span>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              color: "var(--accent)",
              border: "1px solid var(--accent)",
            }}
          >
            {kit.items.length} 个零件
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {kit.summary}
        </p>
      </motion.div>

      {/* 类型筛选 */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveType("all")}
          className="text-xs px-3 py-1.5 rounded-full transition-all font-mono"
          style={{
            background:
              activeType === "all" ? "var(--accent)" : "transparent",
            color:
              activeType === "all"
                ? "var(--bg-primary)"
                : "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          全部
        </button>
        {types.map((type) => {
          const info = DISASSEMBLY_TYPE_LABELS[type];
          const count = kit.items.filter((i) => i.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="text-xs px-3 py-1.5 rounded-full transition-all font-mono flex items-center gap-1.5"
              style={{
                background:
                  activeType === type ? info.color : "transparent",
                color:
                  activeType === type
                    ? "var(--bg-primary)"
                    : "var(--text-secondary)",
                border: `1px solid ${activeType === type ? info.color : "var(--border)"}`,
              }}
            >
              <span>{info.icon}</span>
              {info.label}
              <span style={{ opacity: 0.6 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 零件列表 */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const info = DISASSEMBLY_TYPE_LABELS[item.type];
            const itemId = `${item.type}-${index}`;
            const isCopied = copiedId === itemId;

            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                }}
              >
                {/* 头部 */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base shrink-0">{info.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.name}
                        </h4>
                        <span
                          className="text-xs font-mono shrink-0"
                          style={{ color: info.color }}
                        >
                          {info.label}
                        </span>
                      </div>
                      <p
                        className="text-xs truncate mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(item.code, itemId)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: isCopied
                          ? "var(--status-green)"
                          : "var(--input-bg)",
                        color: isCopied
                          ? "var(--bg-primary)"
                          : "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {isCopied ? (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          已复制
                        </>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          复制
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownload(item.filename, item.code)}
                      className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: "var(--input-bg)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      下载
                    </button>
                  </div>
                </div>

                {/* 文件名 + 语言 */}
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-tertiary)",
                  }}
                >
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.filename}
                  </span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: "var(--text-muted)",
                      background: "var(--input-bg)",
                    }}
                  >
                    {item.language}
                  </span>
                </div>

                {/* 代码块 */}
                <pre
                  className="overflow-x-auto p-4 text-xs leading-relaxed font-mono"
                  style={{
                    background: "var(--code-bg)",
                    color: "var(--text-secondary)",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  <code>{item.code}</code>
                </pre>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
