import Link from "next/link";
import type { AiHotItem } from "@/types";
import AiHotHeroVideo from "@/components/AiHotHeroVideo";
import AiHotList from "@/components/AiHotList";

// ISR：每 30 分钟重新生成一次，避免每次请求都调用外部 API
export const revalidate = 1800;

// Fallback 数据：当外部 API 不可用时显示，确保页面始终有内容
const FALLBACK_ITEMS: AiHotItem[] = [
  {
    id: "fb-1",
    title: "OpenAI 发布 GPT-5 多模态推理模型，支持实时视频理解",
    title_en: null,
    url: "https://openai.com",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    summary: "GPT-5 在数学推理、代码生成和多语言理解方面显著提升，支持原生视频输入与实时分析。",
    category: "大模型",
  },
  {
    id: "fb-2",
    title: "Claude 4 发布：Anthropic 推出 200K 上下文窗口与工具调用增强",
    title_en: null,
    url: "https://anthropic.com",
    source: "Anthropic",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    summary: "Claude 4 在长文档理解、代码重构和 Agent 工作流方面大幅增强，支持并行工具调用。",
    category: "大模型",
  },
  {
    id: "fb-3",
    title: "Google DeepMind 推出 Gemini 2.5 Ultra，多模态 benchmark 创新高",
    title_en: null,
    url: "https://deepmind.google",
    source: "Google DeepMind",
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    summary: "Gemini 2.5 Ultra 在 MMLU、HumanEval 和 MMMU 三项 benchmark 上超越所有竞品。",
    category: "大模型",
  },
  {
    id: "fb-4",
    title: "Vercel 推出 v0 Agents：AI 自主完成全栈应用开发与部署",
    title_en: null,
    url: "https://vercel.com",
    source: "Vercel",
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    summary: "v0 Agents 能自主完成需求分析、UI 设计、代码编写、测试和部署全流程，支持自然语言驱动开发。",
    category: "AI 工具",
  },
  {
    id: "fb-5",
    title: "GitHub Copilot Workspace 正式上线：AI 驱动的全流程开发环境",
    title_en: null,
    url: "https://github.com",
    source: "GitHub",
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    summary: "从 issue 到 PR 全自动，Copilot Workspace 集成代码审查、测试生成和自动修复功能。",
    category: "开发工具",
  },
  {
    id: "fb-6",
    title: "Meta 开源 Llama 4：405B 参数模型支持 128 种语言",
    title_en: null,
    url: "https://meta.ai",
    source: "Meta AI",
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    summary: "Llama 4 405B 成为最大的开源模型之一，在多语言推理和代码生成方面接近 GPT-5 水平。",
    category: "开源模型",
  },
  {
    id: "fb-7",
    title: "AI 编程赛道融资热潮：Cursor 估值超 50 亿美元",
    title_en: null,
    url: "https://cursor.com",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    summary: "AI 代码编辑器 Cursor 完成新一轮融资，估值翻倍，反映 AI 编程工具市场的快速增长。",
    category: "行业动态",
  },
  {
    id: "fb-8",
    title: "MCP 协议生态扩展：500+ 工具服务接入 Model Context Protocol",
    title_en: null,
    url: "https://modelcontextprotocol.io",
    source: "Anthropic",
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    summary: "MCP 正在成为 AI Agent 连接外部工具的事实标准，数据库、API、文件系统等均有成熟实现。",
    category: "AI 协议",
  },
  {
    id: "fb-9",
    title: "OpenAI 推出 Sora 2.0：支持 4K 视频生成与物理模拟",
    title_en: null,
    url: "https://openai.com/sora",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 42 * 3600000).toISOString(),
    summary: "Sora 2.0 支持生成最长 60 秒的 4K 视频，新增物理引擎模拟真实光影与运动轨迹。",
    category: "多模态",
  },
  {
    id: "fb-10",
    title: "xAI Grok 4 发布：马斯克称推理能力超越 GPT-5",
    title_en: null,
    url: "https://x.ai",
    source: "xAI",
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    summary: "Grok 4 在数学和科学推理 benchmark 上取得新高，支持实时搜索与 X 平台数据接入。",
    category: "大模型",
  },
  {
    id: "fb-11",
    title: "DeepSeek-V3 开源：671B 参数 MoE 模型，训练成本仅 557 万美元",
    title_en: null,
    url: "https://deepseek.com",
    source: "DeepSeek",
    publishedAt: new Date(Date.now() - 54 * 3600000).toISOString(),
    summary: "DeepSeek-V3 用 2048 张 H800 训练 2 个月，性能对标 GPT-4o，开源权重可本地部署。",
    category: "开源模型",
  },
  {
    id: "fb-12",
    title: "LangChain 推出 LangGraph 1.0：生产级 AI Agent 编排框架",
    title_en: null,
    url: "https://langchain.com",
    source: "LangChain",
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    summary: "LangGraph 1.0 支持状态机、检查点和人工介入，已用于多个企业级 Agent 生产环境。",
    category: "AI 框架",
  },
  {
    id: "fb-13",
    title: "Replit Agent 2.0 上线：从自然语言到全栈应用 5 分钟完成",
    title_en: null,
    url: "https://replit.com",
    source: "Replit",
    publishedAt: new Date(Date.now() - 66 * 3600000).toISOString(),
    summary: "Replit Agent 2.0 支持数据库设计、API 开发、前端搭建和部署全流程自动化。",
    category: "AI 工具",
  },
  {
    id: "fb-14",
    title: "Apple Intelligence 2.0 集成 Siri 大升级：支持跨 App 操作链",
    title_en: null,
    url: "https://apple.com",
    source: "Apple",
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    summary: "新版 Siri 可理解复杂上下文，跨应用执行多步操作，端侧模型保护隐私数据。",
    category: "AI 应用",
  },
  {
    id: "fb-15",
    title: "Mistral AI 推出 Large 3：欧洲最强开源大模型，128K 上下文",
    title_en: null,
    url: "https://mistral.ai",
    source: "Mistral AI",
    publishedAt: new Date(Date.now() - 78 * 3600000).toISOString(),
    summary: "Mistral Large 3 在欧洲语言理解和生成方面表现优异，支持函数调用与 RAG。",
    category: "开源模型",
  },
  {
    id: "fb-16",
    title: "AI 生成代码占比突破 25%：GitHub 报告显示 Copilot 代码采纳率持续上升",
    title_en: null,
    url: "https://github.blog",
    source: "GitHub",
    publishedAt: new Date(Date.now() - 84 * 3600000).toISOString(),
    summary: "GitHub 年度报告显示 AI 辅助生成的代码已占新增代码的 25%，开发者效率提升 55%。",
    category: "行业动态",
  },
  {
    id: "fb-17",
    title: "Nvidia 发布 NIM 2.0 微服务平台：一键部署任意开源大模型",
    title_en: null,
    url: "https://nvidia.com",
    source: "Nvidia",
    publishedAt: new Date(Date.now() - 90 * 3600000).toISOString(),
    summary: "NIM 2.0 支持 100+ 开源模型的一容器化部署，优化 GPU 推理性能，兼容主流云平台。",
    category: "AI 基础设施",
  },
  {
    id: "fb-18",
    title: "字节跳动豆包大模型 1.5 发布：推理能力大幅提升，API 价格再降 50%",
    title_en: null,
    url: "https://volcengine.com",
    source: "火山引擎",
    publishedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    summary: "豆包 1.5 在中文理解、代码生成和数学推理方面显著提升，输入价格低至 0.0008 元/千 tokens。",
    category: "国产大模型",
  },
  {
    id: "fb-19",
    title: "Vercel AI SDK 4.0 发布：原生支持多模态、流式渲染和工具调用",
    title_en: null,
    url: "https://sdk.vercel.ai",
    source: "Vercel",
    publishedAt: new Date(Date.now() - 102 * 3600000).toISOString(),
    summary: "AI SDK 4.0 统一了多模型调用接口，新增图像生成、语音合成和结构化输出能力。",
    category: "AI 框架",
  },
  {
    id: "fb-20",
    title: "Cognition Labs 推出 Devin 2.0：全自主 AI 软件工程师升级版",
    title_en: null,
    url: "https://cognition.ai",
    source: "Cognition",
    publishedAt: new Date(Date.now() - 108 * 3600000).toISOString(),
    summary: "Devin 2.0 可独立完成需求分析、架构设计、编码、测试和部署，SWE-bench 通过率 23%。",
    category: "AI 工具",
  },
  {
    id: "fb-21",
    title: "OpenAI 推出 GPT-5 mini：轻量化模型 API 价格降低 80%",
    title_en: null,
    url: "https://openai.com",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 114 * 3600000).toISOString(),
    summary: "GPT-5 mini 在保持核心推理能力的同时，推理速度提升 3 倍，适合高并发场景。",
    category: "大模型",
  },
  {
    id: "fb-22",
    title: "Hugging Face 推出 SmolLM2：1.7B 参数端侧模型性能惊艳",
    title_en: null,
    url: "https://huggingface.co",
    source: "Hugging Face",
    publishedAt: new Date(Date.now() - 120 * 3600000).toISOString(),
    summary: "SmolLM2 在手机端可流畅运行，英文理解能力接近 GPT-3.5，模型仅 3.4GB。",
    category: "开源模型",
  },
  {
    id: "fb-23",
    title: "Anthropic 推出 Claude Code：终端内的 AI 编程助手",
    title_en: null,
    url: "https://anthropic.com",
    source: "Anthropic",
    publishedAt: new Date(Date.now() - 126 * 3600000).toISOString(),
    summary: "Claude Code 直接在终端运行，支持代码库理解、文件编辑、命令执行和 Git 操作。",
    category: "AI 工具",
  },
  {
    id: "fb-24",
    title: "Google Gemini 推出 Deep Research 功能：AI 自主完成深度研究",
    title_en: null,
    url: "https://gemini.google.com",
    source: "Google",
    publishedAt: new Date(Date.now() - 132 * 3600000).toISOString(),
    summary: "Gemini Deep Research 可自动浏览数十个网页，生成结构化研究报告，支持多轮迭代。",
    category: "AI 应用",
  },
  {
    id: "fb-25",
    title: "Runway Gen-4 发布：电影级 AI 视频生成，支持角色一致性",
    title_en: null,
    url: "https://runwayml.com",
    source: "Runway",
    publishedAt: new Date(Date.now() - 138 * 3600000).toISOString(),
    summary: "Gen-4 可在多个镜头中保持角色和场景的一致性，被多家影视公司用于前期制作。",
    category: "多模态",
  },
  {
    id: "fb-26",
    title: "AI Agent 框架 CrewAI 1.0 发布：多 Agent 协作生产就绪",
    title_en: null,
    url: "https://crewai.com",
    source: "CrewAI",
    publishedAt: new Date(Date.now() - 144 * 3600000).toISOString(),
    summary: "CrewAI 1.0 支持角色定义、任务分配和流程编排，已有 500+ 企业在生产环境使用。",
    category: "AI 框架",
  },
  {
    id: "fb-27",
    title: "阿里通义千问 3.0 发布：开源 235B 参数，中文能力全球第一",
    title_en: null,
    url: "https://qwenlm.ai",
    source: "阿里云",
    publishedAt: new Date(Date.now() - 150 * 3600000).toISOString(),
    summary: "Qwen3-235B 在 C-Eval、CMMLU 等中文 benchmark 超越所有模型，Apache 2.0 开源。",
    category: "国产大模型",
  },
  {
    id: "fb-28",
    title: "OpenAI 推出 Realtime API：支持实时语音对话，延迟低于 300ms",
    title_en: null,
    url: "https://openai.com",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 156 * 3600000).toISOString(),
    summary: "Realtime API 基于 WebSocket 实现全双工语音对话，支持打断、情感识别和语音克隆。",
    category: "多模态",
  },
  {
    id: "fb-29",
    title: "GitHub 推出 Spark：自然语言生成完整 GitHub Action 工作流",
    title_en: null,
    url: "https://github.com",
    source: "GitHub",
    publishedAt: new Date(Date.now() - 162 * 3600000).toISOString(),
    summary: "Spark 可根据自然语言描述自动生成 CI/CD 配置，支持测试、部署、通知等场景。",
    category: "开发工具",
  },
  {
    id: "fb-30",
    title: "Perplexity 推出 Comet 浏览器：AI 原生浏览体验",
    title_en: null,
    url: "https://perplexity.ai",
    source: "Perplexity",
    publishedAt: new Date(Date.now() - 168 * 3600000).toISOString(),
    summary: "Comet 浏览器内置 AI 助手，支持页面摘要、跨标签搜索和自动填表，挑战 Chrome。",
    category: "AI 应用",
  },
  {
    id: "fb-31",
    title: "Stability AI 推出 Stable Diffusion 4：8K 图像生成与精准控制",
    title_en: null,
    url: "https://stability.ai",
    source: "Stability AI",
    publishedAt: new Date(Date.now() - 174 * 3600000).toISOString(),
    summary: "SD4 支持 8K 分辨率输出，新增 ControlNet 风格迁移和多层编辑能力。",
    category: "多模态",
  },
  {
    id: "fb-32",
    title: "智谱 GLM-5 发布：国产最强推理模型，数学能力对标 o1",
    title_en: null,
    url: "https://zhipuai.cn",
    source: "智谱AI",
    publishedAt: new Date(Date.now() - 180 * 3600000).toISOString(),
    summary: "GLM-5 在 GSM8K 数学推理上达到 95.2%，支持思维链可视化和工具调用。",
    category: "国产大模型",
  },
  {
    id: "fb-33",
    title: "Vercel 收购 Tremor：开源 React 图表库将深度集成 Next.js",
    title_en: null,
    url: "https://vercel.com",
    source: "Vercel",
    publishedAt: new Date(Date.now() - 186 * 3600000).toISOString(),
    summary: "Tremor 将成为 Vercel 数据可视化方案，与 AI SDK 结合生成动态图表。",
    category: "行业动态",
  },
  {
    id: "fb-34",
    title: "ElevenLabs 推出 Voice Cloning 3.0：3 秒音频克隆任意人声",
    title_en: null,
    url: "https://elevenlabs.io",
    source: "ElevenLabs",
    publishedAt: new Date(Date.now() - 192 * 3600000).toISOString(),
    summary: "Voice Cloning 3.0 仅需 3 秒参考音频即可生成高保真语音，支持 32 种语言和情感控制。",
    category: "多模态",
  },
  {
    id: "fb-35",
    title: "Microsoft 推出 AutoGen 0.4：多 Agent 对话框架全面重构",
    title_en: null,
    url: "https://microsoft.github.io/autogen",
    source: "Microsoft",
    publishedAt: new Date(Date.now() - 198 * 3600000).toISOString(),
    summary: "AutoGen 0.4 采用事件驱动架构，支持 Agent 间异步通信、人类反馈和可观测性。",
    category: "AI 框架",
  },
  {
    id: "fb-36",
    title: "Notion AI 2.0 上线：全工作流 AI 助手，支持数据库自动分析",
    title_en: null,
    url: "https://notion.so",
    source: "Notion",
    publishedAt: new Date(Date.now() - 204 * 3600000).toISOString(),
    summary: "Notion AI 2.0 可自动分析数据库内容生成报表，支持跨页面智能搜索和自动摘要。",
    category: "AI 应用",
  },
  {
    id: "fb-37",
    title: "Cohere 推出 Command R+ 2.0：企业级 RAG 专用大模型",
    title_en: null,
    url: "https://cohere.com",
    source: "Cohere",
    publishedAt: new Date(Date.now() - 210 * 3600000).toISOString(),
    summary: "Command R+ 2.0 专为企业检索增强生成优化，支持 128K 上下文和多语言 RAG。",
    category: "大模型",
  },
  {
    id: "fb-38",
    title: "OpenAI 推出 Swarm 框架：轻量级多 Agent 编排实验项目",
    title_en: null,
    url: "https://github.com/openai/swarm",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 216 * 3600000).toISOString(),
    summary: "Swarm 以极简方式实现多 Agent 协作，通过 handoff 机制传递上下文，适合原型开发。",
    category: "AI 框架",
  },
  {
    id: "fb-39",
    title: "AWS Bedrock 支持 Claude 4：企业可一键部署 Anthropic 最新模型",
    title_en: null,
    url: "https://aws.amazon.com",
    source: "AWS",
    publishedAt: new Date(Date.now() - 222 * 3600000).toISOString(),
    summary: "Bedrock 支持 Claude 4 全系列模型，企业可通过 API 直接调用，数据不离开 AWS。",
    category: "AI 基础设施",
  },
  {
    id: "fb-40",
    title: "AI 编程语言 Mojo 正式开源：Python 语法 + C 性能",
    title_en: null,
    url: "https://modular.com",
    source: "Modular",
    publishedAt: new Date(Date.now() - 228 * 3600000).toISOString(),
    summary: "Mojo 开源后开发者可免费使用，AI 推理性能比 Python 快 35000 倍，完全兼容 Python 生态。",
    category: "开发工具",
  },
];

async function fetchAiHot(): Promise<AiHotItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(
      "https://aihot.virxact.com/api/public/items?mode=selected&take=20",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0",
        },
        next: { revalidate: 1800 },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn("[AI HOT] API returned non-ok status:", res.status);
      return FALLBACK_ITEMS;
    }
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    // API 返回空数组时也用 fallback
    return items.length > 0 ? items : FALLBACK_ITEMS;
  } catch (error) {
    console.warn("[AI HOT] Failed to fetch, using fallback data:", error instanceof Error ? error.message : "unknown");
    return FALLBACK_ITEMS;
  }
}

export default async function AiHotPage() {
  const items = await fetchAiHot();

  return (
    <>
      {/* ===== Hero — 视频背景 ===== */}
      <section className="aihot-hero">
        {/* 背景视频（含 fallback 渐变 + 淡入过渡） */}
        <AiHotHeroVideo />

        {/* 渐变遮罩 */}
        <div className="aihot-hero-overlay" />

        {/* 内容 */}
        <div className="aihot-hero-content">
          <div className="flex items-center justify-center gap-2 mb-4 fade-in-up">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-eyebrow font-mono"
              style={{ color: "var(--accent)" }}
            >
              LIVE_FEED
            </span>
          </div>

          <h1
            className="fade-in-up"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              animationDelay: "0.05s",
            }}
          >
            AI HOT<span style={{ color: "var(--accent)" }}>.</span>
          </h1>

          <h2
            className="fade-in-up"
            style={{
              color: "var(--accent)",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 600,
              letterSpacing: "0.15em",
              marginTop: "12px",
              animationDelay: "0.1s",
            }}
          >
            AI 热点资讯
          </h2>

          <p
            className="mt-4 text-base leading-relaxed fade-in-up"
            style={{
              color: "var(--text-secondary)",
              maxWidth: "480px",
              margin: "16px auto 0",
              animationDelay: "0.15s",
            }}
          >
            AI 领域最新动态，每 30 分钟刷新
          </p>

          {/* 向下滚动指示器 */}
          <div className="mt-12 fade-in-up scroll-indicator" style={{ animationDelay: "0.3s" }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)", margin: "0 auto" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== 资讯列表 ===== */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 md:px-16 py-16">
        {/* 章节标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-eyebrow font-mono"
              style={{ color: "var(--accent)" }}
            >
              LATEST
            </p>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              {items.length} 条资讯
            </span>
          </div>
          <div className="section-divider" />
        </div>

        {/* 资讯列表 — 客户端分页组件，支持加载更多 */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ color: "var(--text-muted)" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p
              className="mt-4 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              资讯加载中，请稍后再试
            </p>
          </div>
        ) : (
          <AiHotList items={items} />
        )}

        {/* 分割线 */}
        <div className="section-divider my-10" />

        {/* 底部 CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          ← 返回首页
        </Link>
      </div>
    </>
  );
}
