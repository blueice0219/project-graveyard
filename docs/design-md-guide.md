# Awesome DESIGN.md 使用说明

> 来源：[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
> 已安装设计系统：VoltAgent（深黑画布 + 翡翠绿 accent）
> 安装位置：项目根目录 `DESIGN.md`

---

## 一、它是什么

**Awesome DESIGN.md** 是 VoltAgent 维护的开源仓库，收录了 66+ 个知名网站的 **DESIGN.md** 设计系统文档。

**DESIGN.md** 是 Google Stitch 在 2026 年提出的新概念：一份纯 Markdown 文件，描述一个完整的设计系统（颜色、字体、间距、组件样式、布局原则）。AI agent 读取后，能生成视觉一致的 UI。

| 文件 | 谁读它 | 定义什么 |
|---|---|---|
| `AGENTS.md` | 编码 agent | 项目怎么构建 |
| `DESIGN.md` | 设计 agent | 项目长什么样 |

**核心价值**：不需要 Figma 导出、不需要 JSON schema、不需要特殊工具。放一个 Markdown 文件到项目根目录，任何 AI 编码 agent 都能理解。

---

## 二、当前已安装的设计系统

### VoltAgent 风格

选择理由：与项目墓园现有风格高度匹配。

| 维度 | DESIGN.md 规范 | 项目墓园现状 | 匹配度 |
|---|---|---|---|
| 画布色 | `#101010` 近黑 | 暗色模式 `#0a0a0a` | 高 |
| 强调色 | `#00d992` 翡翠绿 | `#5EEAD4` teal 青绿 | 高 |
| 字体 | Inter + SF Mono | 系统字体 + monospace | 中（可升级） |
| 卡片 | 1px hairline 边框，无阴影 | 玻璃拟态 + 边框 | 中（可融合） |
| 按钮 | 6px 圆角矩形 | rounded-lg | 高 |

### 文件位置

```
project-graveyard/
├── DESIGN.md          ← 已安装（VoltAgent 风格）
├── src/
├── package.json
└── ...
```

---

## 三、DESIGN.md 文件结构

每个 DESIGN.md 由两部分组成：

### 1. YAML Frontmatter（机器可读的 design tokens）

```yaml
---
colors:
  primary: "#00d992"       # 强调色
  canvas: "#101010"        # 画布色
  ink: "#f2f2f2"           # 主文字色
  hairline: "#3d3a39"      # 边框色
typography:
  display-xl:
    fontSize: 60px
    fontWeight: 400
    letterSpacing: -0.65px
rounded:
  sm: 6px
  md: 8px
spacing:
  md: 12px
  lg: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
---
```

### 2. Markdown 正文（人类可读的设计原则）

包含 9 个章节：

| # | 章节 | 内容 |
|---|---|---|
| 1 | Overview | 整体氛围、设计哲学 |
| 2 | Colors | 色彩角色 + hex + 功能 |
| 3 | Typography | 字体族、完整层级表 |
| 4 | Layout | 间距系统、网格、留白哲学 |
| 5 | Elevation | 阴影系统、表面层级 |
| 6 | Do's and Don'ts | 设计护栏和反模式 |
| 7 | Agent Prompt Guide | 快速色彩参考 + 即用提示词 |

---

## 四、如何使用

### 方式一：让 AI 读取 DESIGN.md 生成新页面

在 TRAE 中直接说：

```
读取项目根目录的 DESIGN.md，按它的设计系统构建一个 [页面名称] 页面。
要求：颜色用 #101010 画布 + #00d992 强调色，字体用 Inter，
卡片用 1px hairline 边框无阴影，按钮用 6px 圆角矩形。
```

AI 会自动读取 `DESIGN.md`，按规范生成代码。

### 方式二：用 DESIGN.md 重构现有页面

```
读取 DESIGN.md，把当前的 [页面名] 重构为符合该设计系统的风格。
保持现有功能不变，只调整视觉层。
```

### 方式三：混合使用（推荐）

项目墓园已有自己的视觉签名（黑洞动画、玻璃拟态、3D 粒子），可以只采纳 DESIGN.md 的部分规范：

```
读取 DESIGN.md，只采纳以下部分应用到项目：
- 间距系统（spacing tokens）
- 字体层级（typography hierarchy）
- 卡片边框规范（hairline border）
不要改动现有的 teal 配色和黑洞动画。
```

---

## 五、可用设计系统列表

仓库收录了 66+ 个品牌的设计系统，按类别整理：

### 推荐用于项目墓园的风格

| 品牌 | 风格特点 | 匹配理由 |
|---|---|---|
| **VoltAgent** ✅ 已安装 | 深黑 + 翡翠绿 | 最接近现有 teal 配色 |
| **Linear** | 极深黑 + 紫蓝 | 极简精密，工程师美学 |
| **Vercel** | 黑白精确 + Geist | Next.js 原生风格 |
| **Resend** | 极简暗色 + monospace | 开发者文档感 |
| **Cursor** | 暗色 + 渐变 | AI 工具风格 |

### 全部类别

| 类别 | 数量 | 代表品牌 |
|---|---|---|
| AI & LLM 平台 | 12 | Claude, ElevenLabs, Mistral, xAI |
| 开发者工具 | 6 | Cursor, Vercel, Raycast, Warp |
| 后端 & DevOps | 7 | Supabase, MongoDB, Sentry, ClickHouse |
| 生产力 SaaS | 7 | Linear, Notion, Cal.com, Resend |
| 设计 & 创意 | 5 | Figma, Framer, Webflow, Miro |
| 金融 & 加密 | 7 | Stripe, Coinbase, Revolut, Wise |
| 电商零售 | 5 | Airbnb, Nike, Shopify, Starbucks |
| 媒体 & 消费 | 11 | Apple, NVIDIA, Spotify, SpaceX |
| 汽车 | 7 | Tesla, Ferrari, Lamborghini, BMW |
| 复古 Web | 2 | Dell 1996, Nintendo 2001 |

---

## 六、切换设计系统

### 步骤

1. **浏览选风格**：访问 [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
2. **下载 DESIGN.md**：从 `design-md/[品牌名]/DESIGN.md` 路径获取
3. **替换文件**：覆盖项目根目录的 `DESIGN.md`
4. **告诉 AI**：`读取新的 DESIGN.md，按新风格重构页面`

### 示例：切换到 Linear 风格

```bash
# 下载 Linear 的 DESIGN.md
curl -o DESIGN.md https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/linear.app/DESIGN.md
```

然后在 TRAE 中说：`读取新的 DESIGN.md，把首页重构为 Linear 风格。`

---

## 七、DESIGN.md 与 CSS Variables 的对应关系

项目墓园现有的 CSS 变量可以映射到 DESIGN.md tokens：

| DESIGN.md Token | 项目墓园 CSS 变量 | 当前值 | DESIGN.md 值 |
|---|---|---|---|
| `colors.canvas` | `--bg-primary` | `#0a0a0a` | `#101010` |
| `colors.canvas-soft` | `--bg-secondary` | `#111118` | `#1a1a1a` |
| `colors.primary` | `--accent` | `#5EEAD4` | `#00d992` |
| `colors.ink` | `--text-primary` | `#f0f0f0` | `#f2f2f2` |
| `colors.body` | `--text-secondary` | `#a0a0a0` | `#bdbdbd` |
| `colors.mute` | `--text-muted` | `#666666` | `#8b949e` |
| `colors.hairline` | `--border` | `#222230` | `#3d3a39` |

**如果要把项目完全对齐 DESIGN.md**，只需在 `globals.css` 中更新这些变量值即可。

---

## 八、实战工作流

### 场景：用 DESIGN.md 设计一个新页面

1. **确认 DESIGN.md 在根目录**（已安装）
2. **在 TRAE 中输入**：
   ```
   读取 DESIGN.md 设计系统，构建一个「项目排行榜」页面：
   - 使用 #101010 画布背景
   - 排行榜用 hairline 边框表格，无阴影
   - 排名数字用 SF Mono 字体
   - 前三名用 #00d992 强调色标记
   - 页面标题用 Inter 60px regular weight
   ```
3. **AI 会自动**：读取 DESIGN.md → 提取 tokens → 生成符合规范的代码

### 场景：用 DESIGN.md 做设计审查

```
读取 DESIGN.md，检查当前首页是否符合该设计系统的规范。
列出所有不符合的地方，给出修改建议。
```

---

## 九、注意事项

1. **DESIGN.md 是参考，不是枷锁**：项目墓园有自己的视觉签名（黑洞动画、3D 粒子、玻璃拟态），这些是品牌差异化，不需要为了对齐 DESIGN.md 而删除
2. **字体替换**：VoltAgent 用 Inter，项目当前用系统字体。如果想升级，在 `layout.tsx` 中引入 Inter 即可
3. **颜色微调**：`#00d992`（DESIGN.md）和 `#5EEAD4`（现有 teal）很接近，可以保留现有 teal 作为签名色
4. **支持 Google Stitch**：DESIGN.md 也可以直接上传到 [Google Stitch](https://stitch.withgoogle.com/) 生成 UI

---

## 十、参考链接

- 仓库地址：[github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- DESIGN.md 规范：[stitch.withgoogle.com/docs/design-md](https://stitch.withgoogle.com/docs/design-md/specification/)
- 在线预览：[getdesign.md](https://getdesign.md)
- Google Stitch：[stitch.withgoogle.com](https://stitch.withgoogle.com)
