import { AiHotItem } from "@/types";

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "未知时间";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN");
}

export default async function AiHotFeed() {
  let items: AiHotItem[] = [];

  try {
    const res = await fetch(
      "https://aihot.virxact.com/api/public/items?mode=selected&take=8",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0",
        },
        next: { revalidate: 1800 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    items = Array.isArray(data?.items) ? data.items : [];
  } catch {
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section>
      {/* 标题行 — 无卡片 */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: "var(--accent)" }}
          />
          <h2
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            AI 热点资讯
          </h2>
        </div>
      </div>

      {/* 横向滚动 — 无卡片容器 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-64 py-3 px-1 transition-all"
          >
            <h3
              className="text-sm font-medium line-clamp-2 mb-2 leading-snug transition-colors group-hover:text-accent"
              style={{ color: "var(--text-primary)" }}
            >
              {item.title}
            </h3>
            <div
              className="flex items-center justify-between text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{item.source}</span>
              <span>{relativeTime(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
