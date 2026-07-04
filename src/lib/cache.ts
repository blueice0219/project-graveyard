/**
 * 缓存接口预留层
 *
 * MVP 阶段使用内存缓存（MemoryCache）。
 * 复赛阶段切换到 Redis 时，只需实现 RedisCache 类并替换 cache 实例即可。
 *
 * 遵循 Redis 最佳实践：
 * - 键命名规范：service:entity:id:attribute（data-key-naming）
 * - 所有缓存键必须设置 TTL（ram-ttl）
 * - 使用原子计数器实现限流（INCR 模式）
 */

// ─── 接口定义 ───────────────────────────────────────────────

export interface CacheClient {
  /** 获取缓存值，不存在返回 null */
  get(key: string): Promise<string | null>;

  /** 设置键值并指定 TTL（秒），TTL 到期自动删除 */
  setex(key: string, ttl: number, value: string): Promise<void>;

  /** 删除指定键 */
  del(key: string): Promise<void>;

  /** 原子自增计数器，返回自增后的值 */
  incr(key: string): Promise<number>;

  /** 为已存在的键设置过期时间 */
  expire(key: string, ttl: number): Promise<void>;
}

// ─── 内存缓存实现（MVP 阶段使用） ─────────────────────────────

class MemoryCache implements CacheClient {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    // 检查是否过期
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async incr(key: string): Promise<number> {
    const entry = this.store.get(key);

    // 检查是否过期
    if (entry && entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
    }

    const current = this.store.get(key);
    const currentValue = current ? parseInt(current.value, 10) || 0 : 0;
    const newValue = currentValue + 1;

    this.store.set(key, {
      value: String(newValue),
      expiresAt: current?.expiresAt ?? null,
    });

    return newValue;
  }

  async expire(key: string, ttl: number): Promise<void> {
    const entry = this.store.get(key);
    if (entry) {
      entry.expiresAt = Date.now() + ttl * 1000;
    }
  }

  /** 清理所有过期键（可选的维护方法） */
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.expiresAt !== null && now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// ─── 缓存键命名规范（data-key-naming） ───────────────────────

export const CacheKeys = {
  /** AI HOT 资讯列表，TTL 30 分钟 */
  aiHotItems: () => "aihot:items:selected",

  /** 项目列表（首页），TTL 60 秒 */
  projectList: () => "projects:list:active",

  /** 单个项目详情，TTL 5 分钟 */
  projectDetail: (id: string) => `projects:detail:${id}`,

  /** AI 评分结果缓存，TTL 7 天（基于项目信息哈希） */
  aiScore: (hash: string) => `ai-score:${hash}`,

  /** 上传限流计数器，TTL 1 小时 */
  rateLimitUpload: (ip: string) => `ratelimit:upload:${ip}`,

  /** 项目浏览计数器（永久，定期同步到数据库） */
  projectViews: (id: string) => `project:${id}:views`,
} as const;

// ─── TTL 常量（ram-ttl：所有缓存键必须设置 TTL） ─────────────

export const CacheTTL = {
  AI_HOT_ITEMS: 1800, // 30 分钟
  PROJECT_LIST: 60, // 1 分钟
  PROJECT_DETAIL: 300, // 5 分钟
  AI_SCORE: 604800, // 7 天
  RATE_LIMIT_UPLOAD: 3600, // 1 小时
} as const;

// ─── 限流配置 ────────────────────────────────────────────────

export const RateLimitConfig = {
  /** 每小时最多上传 5 个项目 */
  UPLOAD_MAX_PER_HOUR: 5,
} as const;

// ─── 导出单例 ────────────────────────────────────────────────

// 开发环境用全局单例避免热更新时重复创建
const globalForCache = globalThis as unknown as {
  cache: CacheClient | undefined;
};

export const cache: CacheClient =
  globalForCache.cache ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.cache = cache;
}
