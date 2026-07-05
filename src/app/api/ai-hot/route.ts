import { NextResponse } from "next/server";
import type { AiHotItem } from "@/types";

/**
 * GET /api/ai-hot?cursor=xxx&take=20
 *
 * 实时从 aihot.virxact.com 获取 AI 资讯，支持 cursor 翻页。
 * 数据源: https://aihot.virxact.com/api/public/items?mode=selected
 *
 * 注意：必须带浏览器 User-Agent，否则被 nginx UA 黑名单 403。
 */

const AIHOT_BASE = "https://aihot.virxact.com";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

interface AiHotApiResponse {
  count: number;
  hasNext: boolean;
  nextCursor: string | null;
  items: AiHotItem[];
}

export async function GET(request: Request) {
  const headers = {
    "Cache-Control": "max-age=600, s-maxage=1800",
  };

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || "";
    const take = Math.min(50, Math.max(5, parseInt(searchParams.get("take") || "20", 10)));

    // 构建 aihot API URL
    const params = new URLSearchParams({
      mode: "selected",
      take: String(take),
    });

    if (cursor) {
      params.set("cursor", cursor);
    }

    const apiUrl = `${AIHOT_BASE}/api/public/items?${params.toString()}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "application/json",
      },
      next: { revalidate: 1800 },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("[AI HOT API] aihot returned:", res.status);
      return NextResponse.json(
        { items: [], hasNext: false, error: `Upstream ${res.status}` },
        { status: 502, headers }
      );
    }

    const data: AiHotApiResponse = await res.json();

    return NextResponse.json(
      {
        items: data.items || [],
        hasNext: data.hasNext !== false,
        nextCursor: data.nextCursor || null,
      },
      { headers }
    );
  } catch (error) {
    console.error("[AI HOT API] Error:", error);
    return NextResponse.json(
      { items: [], hasNext: false, error: "Failed to fetch" },
      { status: 500, headers }
    );
  }
}
