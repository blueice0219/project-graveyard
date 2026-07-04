import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateEpitaph } from "@/lib/db";
import { regenerateEpitaph } from "@/lib/ai-score";
import { cache, CacheKeys } from "@/lib/cache";

// POST /api/regenerate-epitaph - 重新生成墓志铭
export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    // 1. 读取项目信息
    const project = getProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    // 2. 调用 AI 重新生成墓志铭
    const epitaph = await regenerateEpitaph({
      name: project.name,
      description: project.description,
      techStack: project.techStack,
      abandonReason: project.abandonReason,
      deathDiagnosis: project.deathDiagnosis,
    });

    // 3. 更新数据库中的 aiEpitaph 字段
    updateEpitaph(projectId, epitaph);

    // 4. 失效缓存（项目列表 + 项目详情）
    await cache.del(CacheKeys.projectList());
    await cache.del(CacheKeys.projectDetail(projectId));

    // 5. 返回新墓志铭
    return NextResponse.json({ epitaph });
  } catch (error) {
    console.error("Failed to regenerate epitaph:", error);
    return NextResponse.json({ error: "生成失败" }, { status: 500 });
  }
}
