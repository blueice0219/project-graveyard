import { NextResponse } from "next/server";
import { cache, CacheKeys, CacheTTL } from "@/lib/cache";

const AI_HOT_URL =
  "https://aihot.virxact.com/api/public/items?mode=selected&take=8";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0";

// GET /api/ai-hot - 代理请求 AI HOT API，带服务端缓存
// 缓存策略：先查缓存（TTL 30 分钟），未命中再请求外部 API
// 静默失败：任何错误都返回空数组，不向客户端报错
export async function GET() {
  const headers = { "Cache-Control": "max-age=3600" };

  try {
    // 1. 先查缓存（ram-ttl：所有缓存键必须设置 TTL）
    const cacheKey = CacheKeys.aiHotItems();
    const cached = await cache.get(cacheKey);
    if (cached) {
      const items = JSON.parse(cached);
      return NextResponse.json(items, { headers });
    }

    // 2. 缓存未命中，请求外部 API
    const response = await fetch(AI_HOT_URL, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      return NextResponse.json([], { headers });
    }

    const data = await response.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    // 3. 写入缓存，TTL 30 分钟
    if (items.length > 0) {
      await cache.setex(cacheKey, CacheTTL.AI_HOT_ITEMS, JSON.stringify(items));
    }

    return NextResponse.json(items, { headers });
  } catch (error) {
    console.error("Failed to fetch AI HOT items:", error);
    // 静默失败，返回空数组
    return NextResponse.json([], { headers });
  }
}
