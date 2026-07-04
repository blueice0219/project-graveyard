export interface ProjectData {
  id: string;
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  contactInfo: string;
  licenseType: string;
  mindset: string;                // 上传时用户心态: give-up / seeking-handover / memorial
  // 遗产卡字段
  aiVision: string;              // 一句话愿景 (AI 重述)
  deathDiagnosis: string;        // 死因诊断
  completionTier: string;        // 完成度档位: skeleton / half-done / near-usable / almost-there
  completionReason: string;      // 完成度理由
  scoreBlockerType: string;      // 阻塞点类型 (保留用于筛选)
  reusableAssets: string[];      // 可复用资产清单
  revivalDifficulty: string;     // 复活评估: easy / medium / hard
  revivalReason: string;         // 复活评估理由
  recommendedActions: string[];  // 推荐处理方式 (数组, 可组合)
  revivalPath: string;           // 3天复活路径 (空字符串表示不适用)
  aiEpitaph: string;             // 墓志铭
  // 保留的辅助字段
  scoreClarity: string;
  scoreReusability: string;
  scoreDocLevel: string;
  scoreUserValue: string;
  status: string;                // 系统状态: claimable / salvageable / reviving / buried
  createdAt: string;
  updatedAt: string;
}

export interface AiScoreResult {
  aiVision: string;
  deathDiagnosis: string;
  completionTier: string;
  completionReason: string;
  blockerType: string;
  reusableAssets: string[];
  revivalDifficulty: string;
  revivalReason: string;
  recommendedActions: string[];
  revivalPath: string;
  epitaph: string;
  clarity: string;
  reusability: string;
  docLevel: string;
  userValue: string;
}

// ─── 拆件工具包类型 ───────────────────────────────────────────

export type DisassemblyType = "component" | "prompt" | "design-token" | "data-structure";

export interface DisassemblyItem {
  type: DisassemblyType;
  name: string;
  description: string;
  code: string;
  language: string;       // 代码语言标记: typescript, css, markdown, json, bash
  filename: string;       // 建议的文件名
}

export interface DisassemblyKit {
  items: DisassemblyItem[];
  summary: string;        // 拆件总结
}

export const DISASSEMBLY_TYPE_LABELS: Record<DisassemblyType, { label: string; icon: string; color: string }> = {
  component: { label: "组件代码包", icon: "📦", color: "var(--accent)" },
  prompt: { label: "Prompt 文件", icon: "📄", color: "#A78BFA" },
  "design-token": { label: "设计 Token", icon: "🎨", color: "#FBBF24" },
  "data-structure": { label: "数据结构", icon: "🗄️", color: "#60A5FA" },
};

export interface AiHotItem {
  id: string;
  title: string;
  title_en: string | null;
  url: string;
  source: string;
  publishedAt: string | null;
  summary: string | null;
  category: string | null;
}

export const BLOCKER_TYPES: Record<string, { label: string; color: string; dot: string }> = {
  tech: { label: "技术阻塞", color: "text-status-red", dot: "var(--status-red)" },
  design: { label: "设计阻塞", color: "text-purple-400", dot: "#A78BFA" },
  product: { label: "产品阻塞", color: "text-status-yellow", dot: "var(--status-yellow)" },
  resource: { label: "资源阻塞", color: "text-blue-400", dot: "#60A5FA" },
  motivation: { label: "动力阻塞", color: "text-text-muted", dot: "var(--text-muted)" },
};

export const COMPLETION_TIERS: Record<string, { label: string; color: string }> = {
  skeleton: { label: "早期骨架", color: "var(--status-red)" },
  "half-done": { label: "半成品", color: "var(--status-yellow)" },
  "near-usable": { label: "接近可用", color: "var(--accent)" },
  "almost-there": { label: "差临门一脚", color: "var(--status-green)" },
};

export const REVIVAL_DIFFICULTY: Record<string, { label: string; color: string }> = {
  easy: { label: "易", color: "var(--status-green)" },
  medium: { label: "中", color: "var(--status-yellow)" },
  hard: { label: "难", color: "var(--status-red)" },
};

export const CLARITY_LEVELS: Record<string, string> = {
  clear: "清晰",
  vague: "模糊",
  missing: "缺失",
};

export const REUSABILITY_LEVELS: Record<string, { label: string; color: string }> = {
  high: { label: "高", color: "text-green-400" },
  medium: { label: "中", color: "text-yellow-400" },
  low: { label: "低", color: "text-gray-400" },
};

export const DOC_LEVELS: Record<string, string> = {
  complete: "完整",
  basic: "基本",
  missing: "缺失",
};

export const USER_VALUE_LEVELS: Record<string, { label: string; color: string }> = {
  high: { label: "高", color: "text-green-400" },
  medium: { label: "中", color: "text-yellow-400" },
  low: { label: "低", color: "text-gray-400" },
  unknown: { label: "未知", color: "text-gray-400" },
};

export const RECOMMENDED_ACTIONS: Record<string, { label: string; priority: number; tagline: string }> = {
  disassemble: { label: "拆件", priority: 1, tagline: "核心交易" },
  bury: { label: "安葬", priority: 2, tagline: "流量入口" },
  exhibit: { label: "展出", priority: 2, tagline: "传播引擎" },
  revive: { label: "复活", priority: 3, tagline: "叙事门面" },
  merge: { label: "合并", priority: 4, tagline: "纯愿景 · MVP不做" },
};

// 按优先级排序的 action key 列表
export const ACTION_PRIORITY_ORDER = ["disassemble", "bury", "exhibit", "revive", "merge"];

// 上传时用户心态选项
export const MINDSET_OPTIONS: Record<string, { label: string; desc: string; bias: string }> = {
  "give-up": {
    label: "想放弃",
    desc: "不想继续了，能拆点零件出来就行",
    bias: "AI 倾向推荐拆件 / 安葬",
  },
  "seeking-handover": {
    label: "想找人接",
    desc: "自己搞不动了，但希望有人能接手",
    bias: "AI 倾向推荐拆件 + 待认领",
  },
  memorial: {
    label: "只想留个纪念",
    desc: "不打算复活，就想给它一个体面的告别",
    bias: "AI 倾向推荐安葬 + 展出",
  },
};

// 系统状态（四种）
export const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  claimable: { label: "待认领", color: "var(--status-yellow)" },
  salvageable: { label: "可拆件", color: "var(--accent)" },
  reviving: { label: "复活中", color: "var(--status-green)" },
  buried: { label: "已安葬", color: "var(--text-muted)" },
};

// 根据心态 + AI 推荐动作推导系统状态
export function deriveStatus(mindset: string, recommendedActions: string[]): string {
  const actions = new Set(recommendedActions);
  if (mindset === "memorial") return "buried";
  if (mindset === "seeking-handover") return "claimable";
  // give-up
  if (actions.has("bury") && !actions.has("disassemble")) return "buried";
  if (actions.has("revive")) return "reviving";
  return "salvageable";
}
