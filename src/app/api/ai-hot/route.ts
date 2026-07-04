import { NextResponse } from "next/server";
import { cache, CacheKeys, CacheTTL } from "@/lib/cache";
import type { AiHotItem } from "@/types";

/**
 * GET /api/ai-hot?page=1&pageSize=20
 *
 * 实时从 Hacker News API 拉取 AI 相关资讯，支持分页。
 *
 * 策略：
 * 1. 首次请求：获取 HN Top Stories ID 列表（缓存 30 分钟）
 * 2. 按分页批量获取 story 详情（每批 60 条，过滤后约 20 条）
 * 3. 按 AI 关键词过滤标题
 * 4. 映射为 AiHotItem 格式返回
 */

// AI 相关关键词（不区分大小写）
const AI_KEYWORDS = [
  "ai", "ai-", "a.i.", "artificial intelligence",
  "llm", "gpt", "chatgpt", "claude", "gemini", "copilot",
  "openai", "anthropic", "deepmind", "mistral", "deepseek",
  "machine learning", "ml ", "neural", "transformer",
  "diffusion", "stable diffusion", "midjourney", "sora",
  "agent", "agentic", "rag", "embedding", "fine-tun",
  "language model", "foundation model", "multimodal",
  "generative", "prompt", "token", "inference",
  "training", "gpu", "nvidia", "cuda", "tensor",
  "hugging face", "langchain", "vector", "embedding",
  "automation", "autonomous", "robot",
  "llama", "qwen", "通义", "豆包", "文心", "智谱", "moonshot",
  "vibe cod", "cursor", "devin", "replit", "v0",
  "mcp", "model context protocol",
];

// HN item 类型
interface HNItem {
  id: number;
  title: string;
  url: string | null;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

function isAiRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

function classifyCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("gpt") || lower.includes("openai") || lower.includes("chatgpt")) return "OpenAI";
  if (lower.includes("claude") || lower.includes("anthropic")) return "Anthropic";
  if (lower.includes("gemini") || lower.includes("deepmind") || lower.includes("google")) return "Google";
  if (lower.includes("llama") || lower.includes("meta")) return "Meta";
  if (lower.includes("deepseek") || lower.includes("qwen") || lower.includes("通义") || lower.includes("豆包") || lower.includes("智谱")) return "国产大模型";
  if (lower.includes("cursor") || lower.includes("copilot") || lower.includes("devin") || lower.includes("replit") || lower.includes("v0")) return "AI 编程";
  if (lower.includes("agent") || lower.includes("agentic") || lower.includes("langchain") || lower.includes("mcp")) return "AI Agent";
  if (lower.includes("diffusion") || lower.includes("midjourney") || lower.includes("sora") || lower.includes("video")) return "多模态";
  if (lower.includes("open source") || lower.includes("open-source") || lower.includes("hugging")) return "开源模型";
  if (lower.includes("gpu") || lower.includes("nvidia") || lower.includes("chip") || lower.includes("infrastructure")) return "AI 基础设施";
  if (lower.includes("robot") || lower.includes("autonomous")) return "机器人";
  return "AI";
}

function hnToAiHotItem(item: HNItem): AiHotItem {
  return {
    id: `hn-${item.id}`,
    title: item.title,
    title_en: null,
    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    source: "Hacker News",
    publishedAt: new Date(item.time * 1000).toISOString(),
    summary: item.descendants > 0 ? `${item.score} 点赞 · ${item.descendants} 评论` : `${item.score} 点赞`,
    category: classifyCategory(item.title),
  };
}

// 获取 HN Top Stories ID 列表（带缓存）
async function getTopStoryIds(): Promise<number[]> {
  const cacheKey = "hn:topstory:ids";
  const cached = await cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: { revalidate: 1800 },
  });

  if (!res.ok) throw new Error(`HN API error: ${res.status}`);

  const ids: number[] = await res.json();
  await cache.setex(cacheKey, CacheTTL.AI_HOT_ITEMS, JSON.stringify(ids));
  return ids;
}

// 批量获取 story 详情
async function fetchItemsBatch(ids: number[]): Promise<HNItem[]> {
  const promises = ids.map((id) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
      next: { revalidate: 1800 },
    })
      .then((res) => res.json())
      .then((data) => data as HNItem)
      .catch(() => null)
  );

  const results = await Promise.all(promises);
  return results.filter((item): item is HNItem => item !== null && item.type === "story");
}

export async function GET(request: Request) {
  const headers = { "Cache-Control": "max-age=600" };

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(40, Math.max(5, parseInt(searchParams.get("pageSize") || "20", 10)));

    // 获取所有 Top Story ID
    const allIds = await getTopStoryIds();

    // 分页：每页扫描 3x 的 HN story（因为过滤后大约 1/3 是 AI 相关）
    const scanSize = pageSize * 3;
    const startIdx = (page - 1) * scanSize;
    const batchIds = allIds.slice(startIdx, startIdx + scanSize);

    if (batchIds.length === 0) {
      return NextResponse.json({ items: [], hasMore: false, page }, { headers });
    }

    // 获取详情
    const stories = await fetchItemsBatch(batchIds);

    // 过滤 AI 相关
    const aiItems = stories
      .filter((s) => isAiRelated(s.title))
      .map(hnToAiHotItem)
      .slice(0, pageSize);

    const hasMore = startIdx + scanSize < allIds.length;

    return NextResponse.json({
      items: aiItems,
      hasMore,
      page,
      total: allIds.length,
    }, { headers });
  } catch (error) {
    console.error("[AI HOT API] Error:", error);
    return NextResponse.json(
      { items: [], hasMore: false, page: 1, error: "Failed to fetch" },
      { status: 500, headers }
    );
  }
}
