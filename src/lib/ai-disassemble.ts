import type { DisassemblyKit, DisassemblyItem } from "@/types";

/**
 * AI 拆件官 Prompt
 *
 * 核心价值：把烂尾项目拆成"可直接带走"的零件包。
 * 用户体感："我把尸体推进去，推出来一盒还能用的器官"。
 *
 * 输出四类零件：
 * 1. 组件代码包 — 可直接复制使用的 UI 组件 / 工具函数
 * 2. Prompt 文件 — 可直接使用的 Prompt 模板
 * 3. 设计 Token — 可直接引入的 CSS 变量 / 主题配置
 * 4. 数据结构 — 可直接使用的 TypeScript 接口 / 数据模型
 */

const SYSTEM_PROMPT = `你是项目墓园的 AI 拆件官。用户会给你一个烂尾项目的信息，你的任务是把项目"拆"成可直接带走的零件包。

输出四类零件，每类至少 1 个（如果项目信息确实不支持某类，可以省略但需在 summary 说明原因）：

1. **component（组件代码包）**：从项目信息中推断出的、可直接复制使用的 UI 组件或工具函数。必须是完整可运行的代码，不能是伪代码。
   - 如果项目用 React/Vue/Next.js，输出对应框架的组件代码
   - 如果项目用 Python/Node，输出工具函数或 API 处理器
   - 代码要包含必要的 import 和类型定义

2. **prompt（Prompt 文件）**：从项目信息中提取或推断的 Prompt 模板。必须是可直接使用的完整 Prompt。
   - 如果项目涉及 AI/LLM，提取实际使用的 Prompt
   - 如果不涉及 AI 但可以受益于 AI 辅助，生成一个推荐的 Prompt
   - Prompt 要包含 system message 和 user message 的结构

3. **design-token（设计 Token）**：从项目信息中推断的 CSS 变量 / 主题配置。必须是可直接引入的 CSS。
   - 推断项目的配色方案（基于项目描述的领域和调性）
   - 包含颜色、间距、圆角、字体等 token
   - 输出为 :root { ... } 格式的 CSS 代码

4. **data-structure（数据结构）**：从项目信息中推断的 TypeScript 接口 / 数据模型。必须是可直接使用的类型定义。
   - 推断项目的核心数据模型（用户、文章、订单等）
   - 包含 interface / type 定义
   - 包含必要的 JSDoc 注释

【硬性规则】
- 每个零件的 code 必须是完整可用的代码，不能是占位符或伪代码
- 代码量控制在 30-80 行之间，太短没价值，太长不好复制
- filename 要符合实际文件命名规范（如 UserCard.tsx, prompt.md, tokens.css, types.ts）
- description 要说明这个零件能用来做什么
- 如果信息不足需要推断，在 description 中标注「(推测)」

输出纯 JSON，不要 markdown 代码块标记。格式：
{
  "items": [
    {
      "type": "component",
      "name": "用户卡片组件",
      "description": "基于项目描述提取的用户展示卡片，可直接用于 React 项目(推测)",
      "code": "import React from 'react';\\n\\ninterface UserCardProps { ... }\\n\\nexport default function UserCard({ ... }: UserCardProps) { ... }",
      "language": "typescript",
      "filename": "UserCard.tsx"
    }
  ],
  "summary": "从该项目中拆出 4 个零件：1 个组件、1 个 Prompt、1 个设计 Token、1 个数据结构。组件可直接用于..."
}

注意：
- 所有代码必须实际可用，用户复制后能直接运行或稍作修改即可使用
- 这不是展示代码，是"器官"——拿出来就能用
- 所有文本用中文（代码中的注释也用中文）`;

export async function disassembleProject(params: {
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  reusableAssets: string[];
  deathDiagnosis?: string;
}): Promise<DisassemblyKit> {
  const apiKey = process.env.ARK_API_KEY;
  const apiUrl =
    process.env.ARK_API_URL ||
    "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  const model = process.env.ARK_MODEL || "doubao-pro-32k";

  // 未配置 API Key → mock 模式
  if (!apiKey || apiKey === "your-ark-api-key-here") {
    return mockDisassemble(params);
  }

  const userPrompt = `请为以下烂尾项目执行拆件：

项目名称：${params.name}
项目描述：${params.description}
技术栈：${params.techStack}
烂尾原因：${params.abandonReason}
${params.deathDiagnosis ? `死因诊断：${params.deathDiagnosis}` : ""}

可复用资产清单（AI 验尸报告识别）：
${params.reusableAssets.length > 0 ? params.reusableAssets.map((a, i) => `${i + 1}. ${a}`).join("\n") : "（无）"}

README 内容：
${params.readme || "（无 README）"}

请输出 JSON 格式的拆件结果。每个零件的代码必须完整可用。`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ark API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const result = JSON.parse(cleaned);

    return result as DisassemblyKit;
  } catch (error) {
    console.error("AI disassembly failed, using mock:", error);
    return mockDisassemble(params);
  }
}

/**
 * Mock 拆件生成器
 *
 * 根据技术栈和项目信息生成合理的拆件包。
 */
function mockDisassemble(params: {
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  reusableAssets: string[];
}): DisassemblyKit {
  const techs = (params.techStack || "").toLowerCase();
  const isReact = /react|next|vue|svelte/.test(techs);
  const isPython = /python|django|flask|fastapi/.test(techs);
  const isNode = /node|express|nest/.test(techs);
  const hasAI = /openai|gpt|llm|claude|ai|prompt/.test(techs);

  const items: DisassemblyItem[] = [];
  const name = params.name || "该项目";
  const desc = params.description || "某个问题";

  // 1. 组件代码包
  if (isReact) {
    items.push({
      type: "component",
      name: "状态展示卡片组件",
      description: `从 ${name} 项目中提取的状态展示卡片，支持加载/成功/失败三态(推测)`,
      code: `import { useState, useEffect } from 'react';

// 状态展示卡片 — 可直接用于 React/Next.js 项目
interface StatusCardProps {
  title: string;
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export default function StatusCard({ title, status, message }: StatusCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, [status]);

  const colors = {
    loading: '#FBBF24',
    success: '#34D399',
    error: '#F87171',
  };

  return (
    <div
      className="rounded-lg border p-4 transition-all"
      style={{
        borderColor: \`\${colors[status]}40\`,
        background: \`\${colors[status]}08\`,
        opacity: animate ? 1 : 0.5,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: colors[status] }}
        />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  );
}`,
      language: "typescript",
      filename: "StatusCard.tsx",
    });
  } else if (isPython) {
    items.push({
      type: "component",
      name: "API 请求重试装饰器",
      description: `从 ${name} 项目中提取的 API 请求重试工具(推测)`,
      code: `import time
import functools
from typing import Callable, Any

# API 请求重试装饰器 — 可直接用于 Python 项目
def retry(max_retries: int = 3, delay: float = 1.0):
    """请求失败自动重试，适用于不稳定的第三方 API"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_error = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    if attempt < max_retries - 1:
                        time.sleep(delay * (attempt + 1))
            raise last_error
        return wrapper
    return decorator

# 使用示例：
# @retry(max_retries=3, delay=0.5)
# def fetch_user_data(user_id):
#     ...`,
      language: "python",
      filename: "retry_decorator.py",
    });
  } else {
    items.push({
      type: "component",
      name: "通用工具函数集",
      description: `从 ${name} 项目中提取的工具函数(推测)`,
      code: `// 通用工具函数 — 可直接用于任何 JavaScript/TypeScript 项目

/** 防抖函数 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** 深拷贝（JSON 安全的对象） */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** 格式化日期为相对时间 */
export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return \`\${minutes} 分钟前\`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return \`\${hours} 小时前\`;
  return d.toLocaleDateString('zh-CN');
}`,
      language: "typescript",
      filename: "utils.ts",
    });
  }

  // 2. Prompt 文件
  if (hasAI) {
    items.push({
      type: "prompt",
      name: "项目核心 Prompt 模板",
      description: `从 ${name} 项目中提取的 AI 交互 Prompt，可直接复用(推测)`,
      code: `# Prompt 模板 — ${name}

## System Message

你是一个专门帮助用户${desc}的 AI 助手。
请根据用户输入提供准确、有用的回答。
如果信息不足，请主动追问。

## User Message 模板

用户输入：{user_input}
上下文：{context}
期望输出格式：{output_format}

## 使用说明

1. 将 {user_input} 替换为实际用户输入
2. {context} 可选，提供相关背景信息
3. {output_format} 指定期望的输出格式（如 JSON、Markdown、纯文本）

## few-shot 示例

输入：帮我分析这个项目的可行性
输出：{
  "feasibility": "high/medium/low",
  "reason": "...",
  "suggestion": "..."
}`,
      language: "markdown",
      filename: "prompt-template.md",
    });
  } else {
    items.push({
      type: "prompt",
      name: "项目复盘 Prompt",
      description: `为 ${name} 生成的项目复盘 Prompt，可用于 AI 辅助分析烂尾原因`,
      code: `# 项目复盘 Prompt — ${name}

## System Message

你是一个项目复盘专家。请帮用户分析烂尾项目的原因，
并给出可执行的改进建议。

## User Message

项目名称：${name}
项目描述：${desc}
技术栈：${params.techStack}
烂尾原因：${params.abandonReason}

请从以下维度分析：
1. 项目目标是否清晰
2. 技术选型是否合理
3. 时间规划是否现实
4. 资源配置是否充分
5. 最核心的失败原因是什么
6. 如果重来，第一步应该做什么

请输出结构化分析报告。`,
      language: "markdown",
      filename: "retrospective-prompt.md",
    });
  }

  // 3. 设计 Token
  items.push({
    type: "design-token",
    name: "项目设计系统 Token",
    description: `为 ${name} 推断的设计 Token，包含配色、间距、圆角(推测)`,
    code: `/* 设计 Token — ${name} */
/* 可直接引入到项目的 CSS 中 */

:root {
  /* — 配色（基于项目调性推断）— */
  --color-primary: #5EEAD4;
  --color-primary-hover: #7FF5E0;
  --color-primary-dim: #2DD4BF;
  --color-bg-primary: #08090d;
  --color-bg-secondary: #0e1015;
  --color-bg-elevated: #1a1d24;
  --color-text-primary: #e8eaed;
  --color-text-secondary: #9ca3af;
  --color-text-muted: #565d6b;
  --color-border: rgba(94, 234, 212, 0.10);
  --color-border-hover: rgba(94, 234, 212, 0.30);
  --color-status-red: #F87171;
  --color-status-yellow: #FBBF24;
  --color-status-green: #34D399;

  /* — 间距系统 — */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;

  /* — 圆角 — */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;

  /* — 字体 — */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}`,
    language: "css",
    filename: "tokens.css",
  });

  // 4. 数据结构
  if (isReact || isNode) {
    items.push({
      type: "data-structure",
      name: "项目核心数据模型",
      description: `从 ${name} 项目中推断的核心数据结构(推测)`,
      code: `// 核心数据模型 — ${name}
// 可直接用于 TypeScript 项目

/** 用户模型 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/** 项目模型 */
export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: 'active' | 'archived' | 'deleted';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

/** API 响应包装 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}`,
      language: "typescript",
      filename: "types.ts",
    });
  } else if (isPython) {
    items.push({
      type: "data-structure",
      name: "Pydantic 数据模型",
      description: `从 ${name} 项目中推断的 Pydantic 数据模型(推测)`,
      code: `from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# 核心数据模型 — ${name}
# 可直接用于 FastAPI / Pydantic 项目

class User(BaseModel):
    """用户模型"""
    id: str = Field(..., description="用户唯一标识")
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\\.[^@]+$')
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class Project(BaseModel):
    """项目模型"""
    id: str = Field(..., description="项目唯一标识")
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field("", max_length=500)
    tech_stack: List[str] = Field(default_factory=list)
    status: str = Field("active", pattern="^(active|archived|deleted)$")
    owner_id: str = Field(..., description="所有者用户 ID")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)`,
      language: "python",
      filename: "models.py",
    });
  } else {
    items.push({
      type: "data-structure",
      name: "JSON Schema 数据模型",
      description: `从 ${name} 项目中推断的数据结构(推测)`,
      code: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "${name} 数据模型",
  "description": "项目核心数据结构定义",
  "definitions": {
    "User": {
      "type": "object",
      "required": ["id", "name", "email"],
      "properties": {
        "id": { "type": "string", "description": "用户唯一标识" },
        "name": { "type": "string", "minLength": 1, "maxLength": 100 },
        "email": { "type": "string", "format": "email" },
        "avatar": { "type": "string", "format": "uri" },
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" }
      }
    },
    "Project": {
      "type": "object",
      "required": ["id", "name", "ownerId"],
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string", "maxLength": 200 },
        "description": { "type": "string", "maxLength": 500 },
        "techStack": { "type": "array", "items": { "type": "string" } },
        "status": { "type": "string", "enum": ["active", "archived", "deleted"] },
        "ownerId": { "type": "string" }
      }
    }
  }
}`,
      language: "json",
      filename: "schema.json",
    });
  }

  return {
    items,
    summary: `从 ${name} 中拆出 ${items.length} 个零件：${items.length} 个可直接使用的代码包。每个零件都经过清理和格式化，复制后稍作修改即可集成到新项目中。`,
  };
}
