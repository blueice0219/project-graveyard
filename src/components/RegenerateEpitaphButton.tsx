"use client";

import { useState } from "react";

interface RegenerateEpitaphButtonProps {
  projectId: string;
  currentEpitaph: string;
  onRegenerated: (newEpitaph: string) => void;
}

export default function RegenerateEpitaphButton({
  projectId,
  onRegenerated,
}: RegenerateEpitaphButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/regenerate-epitaph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) throw new Error("生成失败");
      const data = await res.json();
      onRegenerated(data.epitaph);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all hover:border-accent disabled:opacity-50"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        {loading ? (
          <>
            <svg
              className="spin-loading"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            抽卡中...
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
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            重新生成墓志铭
          </>
        )}
      </button>
      {error && (
        <span className="text-xs" style={{ color: "var(--status-red)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
