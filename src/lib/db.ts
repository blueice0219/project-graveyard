/**
 * JSON 文件存储层
 *
 * 替代 Prisma + SQLite，兼容 serverless 部署环境（IGA Pages）。
 * 数据存储在项目根目录的 data/projects.json 文件中。
 *
 * 注意：serverless 环境下文件写入可能不持久（重启后丢失）。
 * 种子数据在首次加载时自动初始化。
 */

import fs from "fs";
import path from "path";
import { seedProjects } from "./seed-data";

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  contactInfo: string;
  licenseType: string;
  mindset: string;
  // 遗产卡字段
  aiVision: string;
  deathDiagnosis: string;
  completionTier: string;
  completionReason: string;
  scoreBlockerType: string;
  reusableAssets: string[];
  revivalDifficulty: string;
  revivalReason: string;
  recommendedActions: string[];
  revivalPath: string;
  aiEpitaph: string;
  // 保留的辅助评分字段
  scoreClarity: string;
  scoreReusability: string;
  scoreDocLevel: string;
  scoreUserValue: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 内存缓存（serverless 环境下每次冷启动会重新初始化）
let projectsCache: ProjectRecord[] | null = null;

function getDataFilePath(): string {
  return path.join(process.cwd(), "data", "projects.json");
}

function ensureDataDir(): void {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      // serverless 环境可能无法创建目录，忽略
    }
  }
}

function loadProjects(): ProjectRecord[] {
  if (projectsCache) return projectsCache;

  // 尝试从文件加载
  try {
    const filePath = getDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      projectsCache = JSON.parse(raw);
      return projectsCache!;
    }
  } catch {
    // 文件读取失败，继续用种子数据初始化
  }

  // 文件不存在，用种子数据初始化
  // 种子数据已包含遗产卡字段，此处只补齐 id/status/时间戳
  projectsCache = seedProjects.map((p, i) => ({
    ...p,
    id: p.id || `seed-${i}`,
    status: p.status || "salvageable",
    mindset: p.mindset || "give-up",
    createdAt: new Date(Date.now() - (8 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (8 - i) * 86400000).toISOString(),
  }));

  // 尝试写入文件（serverless 环境可能失败，忽略）
  saveProjects();

  return projectsCache;
}

function saveProjects(): void {
  if (!projectsCache) return;
  try {
    ensureDataDir();
    fs.writeFileSync(getDataFilePath(), JSON.stringify(projectsCache, null, 2), "utf-8");
  } catch {
    // serverless 环境可能无法写入文件，数据仅保留在内存中
  }
}

function generateId(): string {
  return (
    "p" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}

// ─── 数据操作接口 ────────────────────────────────────────────

export function getAllProjects(): ProjectRecord[] {
  const projects = loadProjects();
  return projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getProjectById(id: string): ProjectRecord | null {
  const projects = loadProjects();
  return projects.find((p) => p.id === id) || null;
}

export function createProject(data: {
  name: string;
  description: string;
  readme?: string;
  techStack?: string;
  abandonReason?: string;
  contactInfo?: string;
  licenseType?: string;
  mindset?: string;
}): ProjectRecord {
  const projects = loadProjects();
  const now = new Date().toISOString();

  const project: ProjectRecord = {
    id: generateId(),
    name: data.name,
    description: data.description,
    readme: data.readme || "",
    techStack: data.techStack || "",
    abandonReason: data.abandonReason || "",
    contactInfo: data.contactInfo || "",
    licenseType: data.licenseType || "MIT",
    mindset: data.mindset || "give-up",
    // 遗产卡字段初始为空，等待 AI 评分填充
    aiVision: "",
    deathDiagnosis: "",
    completionTier: "",
    completionReason: "",
    scoreBlockerType: "",
    reusableAssets: [],
    revivalDifficulty: "",
    revivalReason: "",
    recommendedActions: [],
    revivalPath: "",
    aiEpitaph: "",
    scoreClarity: "",
    scoreReusability: "",
    scoreDocLevel: "",
    scoreUserValue: "",
    status: "salvageable",
    createdAt: now,
    updatedAt: now,
  };

  projects.push(project);
  saveProjects();

  return project;
}

export function updateProjectScore(
  id: string,
  score: {
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
    status?: string;
  }
): ProjectRecord | null {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  projects[idx] = {
    ...projects[idx],
    aiVision: score.aiVision,
    deathDiagnosis: score.deathDiagnosis,
    completionTier: score.completionTier,
    completionReason: score.completionReason,
    scoreBlockerType: score.blockerType,
    reusableAssets: score.reusableAssets,
    revivalDifficulty: score.revivalDifficulty,
    revivalReason: score.revivalReason,
    recommendedActions: score.recommendedActions,
    revivalPath: score.revivalPath,
    aiEpitaph: score.epitaph,
    scoreClarity: score.clarity,
    scoreReusability: score.reusability,
    scoreDocLevel: score.docLevel,
    scoreUserValue: score.userValue,
    ...(score.status ? { status: score.status } : {}),
    updatedAt: new Date().toISOString(),
  };

  saveProjects();

  return projects[idx];
}

/**
 * 仅更新墓志铭字段（用于「重新生成墓志铭」功能）
 *
 * 逻辑与 updateProjectScore 类似，但只更新 aiEpitaph 和 updatedAt，
 * 不触碰其他遗产卡字段。同步更新内存缓存并尝试持久化到文件。
 */
export function updateEpitaph(
  id: string,
  epitaph: string
): ProjectRecord | null {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  projects[idx] = {
    ...projects[idx],
    aiEpitaph: epitaph,
    updatedAt: new Date().toISOString(),
  };

  saveProjects();

  return projects[idx];
}

/**
 * 仅更新项目状态（用于「我要复活」功能）
 *
 * 将项目状态更新为指定值（通常为 "reviving"），
 * 同步更新内存缓存并尝试持久化到文件。
 */
export function updateProjectStatus(
  id: string,
  status: string
): ProjectRecord | null {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = {
    ...projects[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  saveProjects();
  return projects[idx];
}
