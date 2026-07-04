import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/lib/db";
import { disassembleProject } from "@/lib/ai-disassemble";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body as { projectId?: string };

    if (!projectId) {
      return NextResponse.json(
        { error: "缺少 projectId" },
        { status: 400 }
      );
    }

    const projects = getAllProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        { error: "项目不存在" },
        { status: 404 }
      );
    }

    const kit = await disassembleProject({
      name: project.name,
      description: project.description,
      readme: project.readme,
      techStack: project.techStack,
      abandonReason: project.abandonReason,
      reusableAssets: project.reusableAssets,
      deathDiagnosis: project.deathDiagnosis,
    });

    return NextResponse.json(kit);
  } catch (error) {
    console.error("Disassembly API error:", error);
    return NextResponse.json(
      { error: "拆件失败，请稍后重试" },
      { status: 500 }
    );
  }
}
