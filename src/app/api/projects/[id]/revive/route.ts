import { NextRequest, NextResponse } from "next/server";
import { getProjectById, updateProjectStatus } from "@/lib/db";
import { cache, CacheKeys } from "@/lib/cache";

// POST /api/projects/[id]/revive - 更新项目状态为「复活中」
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProjectById(params.id);
    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    const { contact, plan } = await req.json();

    // 验证请求体
    if (!contact?.trim() || !plan?.trim()) {
      return NextResponse.json(
        { error: "联系方式和复活计划均为必填" },
        { status: 400 }
      );
    }

    // 更新状态为复活中
    updateProjectStatus(params.id, "reviving");

    // 失效缓存（项目列表 + 项目详情）
    await cache.del(CacheKeys.projectList());
    await cache.del(CacheKeys.projectDetail(params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to revive project:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
