import { NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/db";
import { scoreProject } from "@/lib/ai-score";
import { deriveStatus } from "@/types";
import { cache, CacheKeys, CacheTTL, RateLimitConfig } from "@/lib/cache";

// GET /api/projects - 返回所有项目（含全部 4 种状态），按 createdAt 倒序
export async function GET() {
  try {
    // 1. 先查缓存
    const cacheKey = CacheKeys.projectList();
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // 2. 缓存未命中，查数据
    const projects = getAllProjects();

    // 3. 写入缓存，TTL 60 秒
    await cache.setex(cacheKey, CacheTTL.PROJECT_LIST, JSON.stringify(projects));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建项目后调用 AI 评分，把评分结果写入
// 限流策略：基于 IP 的滑动窗口限流，每小时最多 5 次上传
export async function POST(request: Request) {
  try {
    // 0. 限流检查
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitKey = CacheKeys.rateLimitUpload(clientIp);
    const currentCount = await cache.incr(rateLimitKey);

    if (currentCount === 1) {
      await cache.expire(rateLimitKey, CacheTTL.RATE_LIMIT_UPLOAD);
    }

    if (currentCount > RateLimitConfig.UPLOAD_MAX_PER_HOUR) {
      return NextResponse.json(
        { error: "上传过于频繁，请稍后再试（每小时限 5 次）" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      techStack,
      abandonReason,
      readme,
      contactInfo,
      licenseType,
      mindset,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "name and description are required" },
        { status: 400 }
      );
    }

    const MAX_FIELD_LENGTH = 5000;
    if (
      name.length > 200 ||
      description.length > 500 ||
      (readme && readme.length > MAX_FIELD_LENGTH) ||
      (abandonReason && abandonReason.length > MAX_FIELD_LENGTH)
    ) {
      return NextResponse.json(
        { error: "字段长度超出限制" },
        { status: 400 }
      );
    }

    // 1. 创建项目
    const project = createProject({
      name,
      description,
      techStack,
      abandonReason,
      readme,
      contactInfo,
      licenseType,
      mindset,
    });

    // 2. 调用 scoreProject 进行 AI 评分
    const score = await scoreProject({
      name: project.name,
      description: project.description,
      readme: project.readme,
      techStack: project.techStack,
      abandonReason: project.abandonReason,
      mindset: project.mindset,
    });

    // 3. 把评分结果更新到项目记录
    const { updateProjectScore } = await import("@/lib/db");
    // 根据用户心态 + AI 推荐动作推导系统状态
    const derivedStatus = deriveStatus(project.mindset, score.recommendedActions);
    const scoredProject = updateProjectScore(project.id, {
      aiVision: score.aiVision,
      deathDiagnosis: score.deathDiagnosis,
      completionTier: score.completionTier,
      completionReason: score.completionReason,
      blockerType: score.blockerType,
      reusableAssets: score.reusableAssets,
      revivalDifficulty: score.revivalDifficulty,
      revivalReason: score.revivalReason,
      recommendedActions: score.recommendedActions,
      revivalPath: score.revivalPath,
      epitaph: score.epitaph,
      clarity: score.clarity,
      reusability: score.reusability,
      docLevel: score.docLevel,
      userValue: score.userValue,
      status: derivedStatus,
    });

    // 4. 失效项目列表缓存
    await cache.del(CacheKeys.projectList());

    // 5. 返回创建的项目（包含评分结果）
    return NextResponse.json(scoredProject || project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
