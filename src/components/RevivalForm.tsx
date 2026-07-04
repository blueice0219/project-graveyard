"use client";

import { useState } from "react";

interface RevivalFormProps {
  projectId: string;
}

export default function RevivalForm({ projectId }: RevivalFormProps) {
  const [contact, setContact] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || !plan.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/revive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, plan }),
      });
      if (!res.ok) throw new Error("提交失败");
      setSubmitted(true);
    } catch {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-sm" style={{ color: "var(--accent)" }}>
        已收到你的复活意向。项目状态已更新为「复活中」。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
          你的联系方式
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="GitHub 用户名或邮箱"
          required
          className="w-full bg-transparent border-0 border-b px-0 py-2 text-sm transition-colors focus:outline-none focus:border-accent"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-secondary)" }}>
          一句话说明你打算怎么复活
        </label>
        <input
          type="text"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="例如：用 RAG 重写推荐引擎"
          required
          className="w-full bg-transparent border-0 border-b px-0 py-2 text-sm transition-colors focus:outline-none focus:border-accent"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--bg-primary)" }}
      >
        {loading ? "提交中..." : "我要复活它 →"}
      </button>
    </form>
  );
}
