import type { AiScoreResult } from "@/types";

/**
 * AI 验尸官 Prompt（遗产卡版 v3）
 *
 * 重构要点：
 * - 取消精确百分比（完成度、复活概率），改为「档位 + 理由」
 * - 所有推测性内容显式标注「(推测)」
 * - 输出「项目遗产卡」：愿景 / 死因 / 完成度档位 / 可复用资产 / 复活评估 /
 *   推荐处理方式 / 3天复活路径 / 墓志铭
 */

const SYSTEM_PROMPT = `你是一个专门分析"烂尾项目"的 AI 验尸官。用户会上传一个未完成项目的信息（项目名称、描述、README、技术栈、烂尾原因）。

请生成「项目遗产卡」，包含以下字段：

1. aiVision（一句话愿景）：用一句话重述这个项目想解决什么问题。不是抄描述，而是用你的理解提炼。
2. deathDiagnosis（死因诊断）：项目死在哪一步、为什么。信息不足时必须标注「(推测)」。
3. completionTier（完成度档位）：从以下四档中选一个：
   - skeleton（早期骨架）：只有想法和基本结构，核心功能未实现
   - half-done（半成品）：核心功能部分实现，但关键模块缺失
   - near-usable（接近可用）：主要功能完成，但有明显缺陷或缺失非核心功能
   - almost-there（差临门一脚）：功能基本齐全，只差部署/打磨/修 bug
4. completionReason（完成度理由）：一句话说明为什么给这个档位。
5. blockerType（阻塞点类型）：tech / design / product / resource / motivation
6. reusableAssets（可复用资产清单）：数组，具体到组件/Prompt/页面/数据结构。推断项标注「(推测)」。
7. revivalDifficulty（复活难度）：easy（易）/ medium（中）/ hard（难）
8. revivalReason（复活理由）：一句话说明为什么是这个难度。
9. recommendedActions（推荐处理方式）：数组，可组合。按以下优先级排序（高优先级在前）：
   - disassemble（拆件）— 第一优先级 · 核心交易。整体不值得继续，但局部有价值。适用：有可复用组件/Prompt/页面/数据结构。
   - bury（安葬）— 第二优先级 · 流量入口。不值得继续，建议体面归档。适用：完成度低且无可复用资产。
   - exhibit（展出）— 第二优先级 · 传播引擎。过程有展示价值。适用：失败经验有参考意义、可做 Case Study。
   - revive（复活）— 第三优先级 · 叙事门面。价值还在、成本可控。适用：完成度高、阻塞点明确且有成熟解法。
   - merge（合并）— 第四优先级 · 纯愿景(MVP不做)。方向相近的项目可合并。仅在产品阻塞且方向模糊时推荐。
   【注意】拆件几乎总是适用（只要有可复用资产），应优先推荐。安葬和展出可组合。复活仅在完成度 high 时推荐。

【用户心态偏移】
用户上传时会选择当前心态，请在推荐处理方式（recommendedActions）时根据心态做适度偏移：
- give-up（想放弃）：倾向推荐拆件 / 安葬
- seeking-handover（想找人接）：倾向推荐拆件（保留其他推荐，便于他人认领接手）
- memorial（只想留个纪念）：倾向推荐安葬 + 展出，不推荐复活
心态偏移不 override 客观判断（如无可复用资产时拆件不适用），但会影响推荐优先级与组合。

10. revivalPath（3天复活路径）：仅当 recommendedActions 包含 "revive" 时输出，否则输出空字符串。格式：Day1: xxx / Day2: xxx / Day3: xxx
11. epitaph（墓志铭）：一句自嘲式死亡总结，必须包含具体的技术或产品细节（不能太笼统）。
12. clarity: clear / vague / missing
13. reusability: high / medium / low
14. docLevel: complete / basic / missing
15. userValue: high / medium / low / unknown

【硬性规则】
- 禁止输出精确百分比（如「复活概率 68%」）。用档位 + 理由替代。
- 所有推测性内容必须显式标注「(推测)」。
- 墓志铭必须包含具体技术或产品细节，不能是「一个想改变世界的项目」这种笼统话。

输出纯 JSON，不要 markdown 代码块标记。格式：
{
  "aiVision": "...",
  "deathDiagnosis": "...",
  "completionTier": "half-done",
  "completionReason": "...",
  "blockerType": "tech",
  "reusableAssets": ["偏好问卷交互", "食谱卡片组件", "推荐Prompt(含失败教训)"],
  "revivalDifficulty": "medium",
  "revivalReason": "阻塞点明确且有成熟解法，难在需要一次推荐架构小重构",
  "recommendedActions": ["disassemble", "revive"],
  "revivalPath": "Day1: 重写推荐引擎为RAG架构 / Day2: 接入向量数据库 / Day3: 联调前端+部署",
  "epitaph": "死在登录回调和推荐质量之间，离能用只差一个周末，离好用差一次架构下决心",
  "clarity": "clear",
  "reusability": "high",
  "docLevel": "basic",
  "userValue": "medium"
}

【few-shot 示例】
输入：项目名"TinyCRM"，描述"服务自由职业者的小型CRM"，技术栈"Vue, Element Plus, Node.js"，烂尾原因"权限系统太复杂，表单校验逻辑写不下去"
输出：
{
  "aiVision": "让自由职业者用一个轻量工具管理客户关系，而不是被 Salesforce 们淹没",
  "deathDiagnosis": "死在权限系统设计。RBAC 角色模型设计过复杂，表单校验逻辑无法收尾(推测：未做表单校验中间件抽象)",
  "completionTier": "half-done",
  "completionReason": "客户列表页和基础表单已完成，但权限和校验两大核心模块缺失",
  "blockerType": "tech",
  "reusableAssets": ["客户列表页组件", "基础表单组件", "Vue项目结构(推测)", "SQLite数据模型"],
  "revivalDifficulty": "medium",
  "revivalReason": "阻塞点明确（权限+校验），有成熟开源方案，但需要重构表单层",
  "recommendedActions": ["revive"],
  "revivalPath": "Day1: 用 casl 简化权限模块 + 重写表单校验中间件 / Day2: 补齐数据导出功能 / Day3: 部署 + 基础 e2e 测试",
  "epitaph": "一个想替自由职业者管客户的 CRM，自己死在了权限校验的迷宫里",
  "clarity": "clear",
  "reusability": "medium",
  "docLevel": "basic",
  "userValue": "medium"
}

注意：
- 诚实但建设性，不要美化
- 信息不足时必须标注「(推测)」
- 墓志铭要自嘲但不刻薄，必须含具体技术细节
- 所有文本用中文`;

export async function scoreProject(params: {
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  mindset?: string;
}): Promise<AiScoreResult> {
  const apiKey = process.env.ARK_API_KEY;
  const apiUrl =
    process.env.ARK_API_URL ||
    "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  const model = process.env.ARK_MODEL || "doubao-pro-32k";

  // 如果没有配置 API Key，返回模拟数据（开发模式）
  if (!apiKey || apiKey === "your-ark-api-key-here") {
    return mockScore(params);
  }

  const mindsetLabel: Record<string, string> = {
    "give-up": "想放弃（倾向拆件 / 安葬）",
    "seeking-handover": "想找人接（倾向拆件，便于认领）",
    memorial: "只想留个纪念（倾向安葬 + 展出，不复活）",
  };
  const mindsetText =
    mindsetLabel[params.mindset || "give-up"] || mindsetLabel["give-up"];

  const userPrompt = `请为以下烂尾项目生成「项目遗产卡」：

项目名称：${params.name}
项目描述：${params.description}
技术栈：${params.techStack}
烂尾原因：${params.abandonReason}
用户当前心态：${mindsetText}

README 内容：
${params.readme || "（无 README）"}

请输出 JSON 格式的遗产卡结果，记得对推测性内容标注「(推测)」，并根据用户当前心态在 recommendedActions 上做适度偏移。`;

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
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ark API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // 清理可能的 markdown 代码块标记
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const result = JSON.parse(cleaned);

    return result as AiScoreResult;
  } catch (error) {
    console.error("AI scoring failed, using mock:", error);
    return mockScore(params);
  }
}

/**
 * 开发模式下的模拟评分（确定性逻辑，无随机性）
 *
 * 不再输出精确百分比，改为「档位 + 理由」。覆盖以下 8 类典型场景：
 *   1. tech      + skeleton      → 安葬（技术坎太大、无可复用资产）
 *   2. tech      + half-done     → 拆件 / 复活（medium）
 *   3. tech      + near-usable   → 复活（easy）
 *   4. tech      + almost-there  → 复活（easy）
 *   5. design    + half-done     → 拆件 / 展出（medium）
 *   6. product   + half-done     → 合并 / 拆件（hard）
 *   7. resource  + near-usable   → 复活（easy）
 *   8. motivation + skeleton     → 安葬（hard）
 */
function mockScore(params: {
  name: string;
  description: string;
  readme: string;
  techStack: string;
  abandonReason: string;
  mindset?: string;
}): AiScoreResult {
  const reason = params.abandonReason.toLowerCase();
  const name = params.name || "该项目";
  const desc = (params.description || "").trim();

  // 1. 阻塞点分类（关键词匹配，与线上逻辑保持一致）
  let blockerType = "tech";
  if (/设计|ui|界面|好看|样式|美观/.test(reason)) {
    blockerType = "design";
  } else if (/需求|方向|不知道|迷茫|做什么|没想好/.test(reason)) {
    blockerType = "product";
  } else if (/数据|接口|服务器|账号|api|key|配置报错/.test(reason)) {
    blockerType = "resource";
  } else if (/不想|没动力|懒|放弃|没时间|忙|心态崩/.test(reason)) {
    blockerType = "motivation";
  }

  // 2. 特征推断
  const hasReadme = !!params.readme && params.readme.length > 50;
  const hasTechStack = !!params.techStack && params.techStack.length > 0;
  const reasonLength = params.abandonReason.length;
  const hasClearGoal = desc.length > 10 && !/测试|随便|test/i.test(desc);

  // 3. 完成度档位（基于信息丰富度推断）
  let completionTier = "half-done";
  if (!hasReadme && (!hasTechStack || reasonLength < 20)) {
    completionTier = "skeleton";
  } else if (
    hasReadme &&
    hasTechStack &&
    reasonLength > 50 &&
    blockerType !== "motivation"
  ) {
    completionTier = "almost-there";
  } else if (hasReadme && (hasTechStack || reasonLength > 30)) {
    completionTier = "near-usable";
  } else {
    completionTier = "half-done";
  }

  // 4. 可复用价值
  let reusability = "medium";
  if (hasReadme && hasTechStack) {
    reusability = "high";
  } else if (!hasReadme && !hasTechStack) {
    reusability = "low";
  }

  // 5. 可复用资产清单（基于技术栈推断，推断项标注「(推测)」）
  const reusableAssets: string[] = [];
  if (hasTechStack) {
    const techs = params.techStack.toLowerCase();
    if (/react|vue|next|svelte|flutter/.test(techs)) {
      reusableAssets.push("前端 UI 组件");
    }
    if (/python|node|fastapi|express|django|flask/.test(techs)) {
      reusableAssets.push("后端接口/服务");
    }
    if (/prisma|mysql|postgres|sqlite|mongo|redis|firebase|supabase/.test(techs)) {
      reusableAssets.push("数据模型/Schema");
    }
    if (/tailwind|element|antd|material/.test(techs)) {
      reusableAssets.push("UI 组件库配置(推测)");
    }
    if (/openai|gpt|llm|claude/.test(techs)) {
      reusableAssets.push("Prompt 模板(推测)");
    }
  }
  if (hasReadme) reusableAssets.push("README 文档模板");
  reusableAssets.push("项目结构参考(推测)");

  // 6. 复活难度（阻塞点 × 完成度档位）
  const difficultyMatrix: Record<string, Record<string, string>> = {
    tech: { skeleton: "hard", "half-done": "medium", "near-usable": "easy", "almost-there": "easy" },
    design: { skeleton: "medium", "half-done": "medium", "near-usable": "medium", "almost-there": "easy" },
    product: { skeleton: "hard", "half-done": "hard", "near-usable": "medium", "almost-there": "medium" },
    resource: { skeleton: "medium", "half-done": "medium", "near-usable": "easy", "almost-there": "easy" },
    motivation: { skeleton: "hard", "half-done": "hard", "near-usable": "hard", "almost-there": "medium" },
  };
  const revivalDifficulty = difficultyMatrix[blockerType]?.[completionTier] || "medium";

  // 7. 推荐处理方式（可组合，按优先级排序：拆件 > 安葬/展出 > 复活 > 合并）
  const recommendedActions: string[] = [];
  // 第一优先级：拆件 — 只要有可复用资产就推荐
  if (reusability !== "low" && reusableAssets.length > 0) {
    recommendedActions.push("disassemble");
  }
  // 第二优先级：安葬 — 完成度低且无可复用
  if (completionTier === "skeleton" && reusability === "low") {
    recommendedActions.push("bury");
  }
  // 第二优先级：展出 — 有展示价值（动力阻塞 + 有一定完成度，或设计阻塞）
  if (
    (blockerType === "motivation" && (completionTier === "near-usable" || completionTier === "half-done")) ||
    (blockerType === "design" && completionTier !== "skeleton")
  ) {
    recommendedActions.push("exhibit");
  }
  // 第三优先级：复活 — 完成度高、阻塞点明确
  if (
    completionTier === "almost-there" ||
    (completionTier === "near-usable" && blockerType !== "motivation") ||
    (completionTier === "half-done" && reusability === "high" && blockerType !== "product")
  ) {
    recommendedActions.push("revive");
  }
  // 第四优先级：合并 — 产品阻塞 + 非骨架
  if (blockerType === "product" && completionTier !== "skeleton") {
    recommendedActions.push("merge");
  }
  // 兜底：保证非空，默认拆件
  if (recommendedActions.length === 0) {
    recommendedActions.push("disassemble");
  }
  // 按优先级排序（拆件 > 安葬 > 展出 > 复活 > 合并）
  const priorityMap: Record<string, number> = { disassemble: 1, bury: 2, exhibit: 2, revive: 3, merge: 4 };
  let uniqueActions = Array.from(new Set(recommendedActions)).sort(
    (a, b) => (priorityMap[a] || 99) - (priorityMap[b] || 99)
  );

  // 根据用户心态偏移调整推荐（在客观推荐之后做适度偏移）
  const mindset = params.mindset || "give-up";
  if (mindset === "memorial") {
    // 只想留个纪念：确保推荐安葬 + 展出，移除复活
    uniqueActions = uniqueActions.filter((a) => a !== "revive");
    if (!uniqueActions.includes("bury")) uniqueActions.push("bury");
    if (!uniqueActions.includes("exhibit")) uniqueActions.push("exhibit");
    uniqueActions = uniqueActions.sort(
      (a, b) => (priorityMap[a] || 99) - (priorityMap[b] || 99)
    );
  } else if (mindset === "seeking-handover") {
    // 想找人接：确保推荐拆件（便于认领），移除安葬
    uniqueActions = uniqueActions.filter((a) => a !== "bury");
    if (!uniqueActions.includes("disassemble")) uniqueActions.unshift("disassemble");
    uniqueActions = uniqueActions.sort(
      (a, b) => (priorityMap[a] || 99) - (priorityMap[b] || 99)
    );
  }
  // give-up：保持现有逻辑不变

  // 8. 3天复活路径（仅当推荐复活时输出）
  let revivalPath = "";
  if (uniqueActions.includes("revive")) {
    revivalPath = buildRevivalPath(blockerType, completionTier);
  }

  // 9. 叙事字段（按阻塞点分场景）
  const reasonText = params.abandonReason || "未知原因";
  const techText = params.techStack || "现有技术栈";
  const descShort = desc.length > 0 ? desc.slice(0, 24) : "某个问题";

  const aiVision = hasClearGoal
    ? `用 ${techText} 把"${descShort}"这件事做出来`
    : `想解决某个问题(推测)，但从描述看目标边界模糊`;

  const tierReasons: Record<string, string> = {
    skeleton: `仅有基本结构和想法，核心功能未实现${hasReadme ? "，虽有 README 但项目仍处早期" : "，且无 README 文档(推测)"}`,
    "half-done": `核心功能部分实现，但关键模块缺失${hasTechStack ? `（${techText} 已搭好骨架）` : "(推测：技术栈不明确)"}`,
    "near-usable": `主要功能完成，但有明显缺陷或非核心功能缺失${hasReadme ? "，README 提供了较完整说明" : ""}`,
    "almost-there": `功能基本齐全，只差部署/打磨/修 bug${reasonLength > 30 ? "，烂尾原因也指向收尾阶段" : ""}`,
  };
  const completionReason = tierReasons[completionTier] || tierReasons["half-done"];

  const narratives: Record<
    string,
    { death: string; revivalReason: string; epitaph: string }
  > = {
    tech: {
      death: `死在技术实现环节。「${reasonText}」导致核心功能无法收尾${hasReadme ? "" : "(推测：缺少文档说明具体卡点)"}`,
      revivalReason: `技术阻塞通常有成熟开源方案可替换，难点在重构成本${completionTier === "almost-there" ? "，目前已接近完成所以更易" : completionTier === "skeleton" ? "，且完成度低需补的基础多" : ""}`,
      epitaph: `${name}：一个想用 ${techText} 解决"${descShort}"的项目，最终栽在了「${reasonText}」这个技术坎上`,
    },
    design: {
      death: `死在设计环节。功能可能已实现，但 UI/交互无法收尾${hasReadme ? "" : "(推测：缺少设计稿或组件库)"}`,
      revivalReason: `设计阻塞可用现成组件库或模板快速解决${reusability === "high" ? "，且已有可复用资产" : ""}`,
      epitaph: `${name}：一个后端都跑通了的项目，最后死在了"让它变好看"这条路上`,
    },
    product: {
      death: `死在产品方向。需求模糊，不知道下一步做什么${hasReadme ? "" : "(推测：缺乏需求文档和用户验证)"}`,
      revivalReason: `产品阻塞需要重新定义 MVP，成本主要在想清楚而非写代码${completionTier === "skeleton" ? "，且当前几乎没有可复用的实现" : ""}`,
      epitaph: `${name}：一个什么都想做、最后什么都没做完的项目，死于需求膨胀`,
    },
    resource: {
      death: `死在资源环节。「${reasonText}」导致无法继续${hasReadme ? "" : "(推测)"}`,
      revivalReason: `资源阻塞找到替代数据源/接口或申请到账号即可推进${completionTier === "near-usable" || completionTier === "almost-there" ? "，目前完成度已较高" : ""}`,
      epitaph: `${name}：一个万事俱备只欠东风的项目，东风指的可能就是一个 API Key`,
    },
    motivation: {
      death: `死在动力。没有具体技术障碍，纯粹不想继续了${reasonLength < 20 ? "(推测：缺少详细说明)" : ""}`,
      revivalReason: `动力阻塞最难复活，需要找到新的激励或接手者${reusability === "high" ? "，但已有资产可被复用" : "，且可复用资产有限"}`,
      epitaph: `${name}：一个还没开始就结束的项目，死于"明天再说"的无限循环`,
    },
  };
  const narrative = narratives[blockerType] || narratives.tech;

  // 10. 辅助评分字段
  const clarity = hasClearGoal ? "clear" : "vague";
  const docLevel = hasReadme ? "basic" : "missing";
  let userValue = "medium";
  if (!hasClearGoal) {
    userValue = "low";
  } else if (/解决|帮助|管理|工具|平台|自动化|追踪|记录/.test(desc)) {
    userValue = "high";
  }

  return {
    aiVision,
    deathDiagnosis: narrative.death,
    completionTier,
    completionReason,
    blockerType,
    reusableAssets,
    revivalDifficulty,
    revivalReason: narrative.revivalReason,
    recommendedActions: uniqueActions,
    revivalPath,
    epitaph: narrative.epitaph,
    clarity,
    reusability,
    docLevel,
    userValue,
  };
}

/** 根据阻塞点 + 完成度档位生成 3 天复活路径 */
function buildRevivalPath(
  blockerType: string,
  completionTier: string
): string {
  const day1: Record<string, string> = {
    tech: "Day1: 定位卡点技术方案，引入成熟开源库替换自研实现",
    design: "Day1: 套用现成 UI 组件库（如 shadcn/Element），重做核心页面样式",
    product: "Day1: 重新定义 MVP，砍掉非核心需求，写一页 PRD",
    resource: "Day1: 找到替代数据源/接口或申请所需账号/Key",
    motivation: "Day1: 拆解最小可交付目标，找回做事的即时反馈",
  };
  const day2 =
    completionTier === "skeleton"
      ? "Day2: 搭建核心功能骨架 + 打通主流程"
      : "Day2: 补齐核心功能缺口 + 联调";
  const day3 =
    blockerType === "tech" || completionTier === "almost-there"
      ? "Day3: 修 bug + 部署上线"
      : "Day3: 基础测试 + 部署 + 写最小 README";
  return `${day1[blockerType] || day1.tech} / ${day2} / ${day3}`;
}

// ─── 重新生成墓志铭 ──────────────────────────────────────────

const EPITAPH_SYSTEM_PROMPT = `你是项目墓园的 AI 验尸官。请为以下烂尾项目生成一句新的墓志铭。

要求：
- 一句话，自嘲式
- 必须包含具体的技术或产品细节（不能太笼统）
- 不超过 50 字
- 风格：幽默但不过分刻薄
- 每次生成都要换一个角度或切入点，不要和常见的「死于xxx」句式重复

只输出墓志铭文本本身，不要任何前缀、解释、引号或 markdown 标记。`;

export interface RegenerateEpitaphParams {
  name: string;
  description: string;
  techStack: string;
  abandonReason: string;
  deathDiagnosis?: string;
}

/**
 * 重新生成墓志铭
 *
 * 调用火山引擎 API 生成新墓志铭；未配置 API Key 时回退到 mock 模板随机生成。
 * 每次调用都会随机挑选一个不同风格的模板，保证「重新生成」有变化感。
 */
export async function regenerateEpitaph(
  params: RegenerateEpitaphParams
): Promise<string> {
  const apiKey = process.env.ARK_API_KEY;
  const apiUrl =
    process.env.ARK_API_URL ||
    "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  const model = process.env.ARK_MODEL || "doubao-pro-32k";

  // 未配置 API Key → mock 模式
  if (!apiKey || apiKey === "your-ark-api-key-here") {
    return mockEpitaph(params);
  }

  const userPrompt = `项目信息：
- 名称：${params.name}
- 描述：${params.description}
- 技术栈：${params.techStack}
- 烂尾原因：${params.abandonReason}
${params.deathDiagnosis ? `- 死因诊断：${params.deathDiagnosis}` : ""}

请生成一句新的墓志铭。`;

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
          { role: "system", content: EPITAPH_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ark API error: ${response.status}`);
    }

    const data = await response.json();
    const content: string = data.choices[0]?.message?.content || "";

    // 清理可能的引号和首尾空白
    const cleaned = content
      .replace(/```[\s\S]*?\n?/g, "")
      .replace(/^["'「『]+|["'」』]+$/g, "")
      .trim();

    if (!cleaned) {
      throw new Error("Empty epitaph");
    }

    return cleaned;
  } catch (error) {
    console.error("Epitaph regeneration failed, using mock:", error);
    return mockEpitaph(params);
  }
}

/**
 * Mock 墓志铭生成器
 *
 * 准备 6 个不同风格的模板，根据项目信息填充具体细节。
 * 使用时间戳 + 随机数确保每次调用选取不同模板（避免与上次重复）。
 */
function mockEpitaph(params: RegenerateEpitaphParams): string {
  const name = params.name || "该项目";
  const desc = (params.description || "某个问题").trim();
  const descShort = desc.length > 18 ? desc.slice(0, 18) : desc;
  const tech = params.techStack || "现有技术栈";
  const techShort = tech.split(/[、,，]/)[0].trim() || tech;
  const reason = params.abandonReason || "未知原因";
  const reasonShort = reason.length > 16 ? reason.slice(0, 16) : reason;

  const templates = [
    // 1. 技术坎式
    `${name}：想用 ${techShort} 解决"${descShort}"，最终被「${reasonShort}」绊倒在临门一脚`,
    // 2. 万事俱备式
    `${name}：一个代码写了一半、文档停在 README 标题的项目，死于「${reasonShort}」`,
    // 3. 反差式
    `${name}：愿景是"${descShort}"，现实是 ${techShort} 跑起来了但没人用`,
    // 4. 自嘲式
    `${name}：技术栈选了 ${techShort}，信心满满地开始，然后就没有然后了——「${reasonShort}」`,
    // 5. 哲理式
    `${name}：证明了"从 0 到 1"的 1，比想象中远得多；卡在「${reasonShort}」`,
    // 6. 极简式
    `${name}：${techShort} 写好了，需求"${descShort}"还没等到用户，就先等到了「${reasonShort}」`,
  ];

  // 用时间戳打散，保证每次刷新结果不同
  const idx = Math.floor((Date.now() / 1000 + Math.random() * 6) % templates.length);
  return templates[idx];
}
