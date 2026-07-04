import { NextResponse } from "next/server";
import { getProjectById, updateProjectScore } from "@/lib/db";
import { scoreProject } from "@/lib/ai-score";
import { deriveStatus } from "@/types";
import { cache, CacheKeys } from "@/lib/cache";

// POST /api/ai-score - 手动触发 AI 评分
export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // 1. 从数据层获取项目
    const project = getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 2. 调用 scoreProject 评分
    const score = await scoreProject({
      name: project.name,
      description: project.description,
      readme: project.readme,
      techStack: project.techStack,
      abandonReason: project.abandonReason,
      mindset: project.mindset,
    });

    // 3. 根据心态 + AI 推荐动作推导系统状态
    const derivedStatus = deriveStatus(project.mindset, score.recommendedActions);

    // 4. 更新评分字段
    const updatedProject = updateProjectScore(projectId, {
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

    // 4. 失效缓存
    await cache.del(CacheKeys.projectList());
    await cache.del(CacheKeys.projectDetail(projectId));

    // 5. 返回评分结果
    return NextResponse.json({
      project: updatedProject,
      score,
    });
  } catch (error) {
    console.error("Failed to score project:", error);
    return NextResponse.json(
      { error: "Failed to score project" },
      { status: 500 }
    );
  }
}
