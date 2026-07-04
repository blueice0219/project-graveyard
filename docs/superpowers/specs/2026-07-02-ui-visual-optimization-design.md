# UI 视觉优化设计文档

> 日期：2026-07-02
> 项目：Project Graveyard / 项目墓园
> 目标：Trae AI 创造力大赛 demo 视觉升级，前 3 秒抓住评委

## 1. 设计方向

- **比赛印象优先**：评委打开页面前 3 秒被抓住，强调视觉冲击力和独特性
- **极简未来风格**：不走墓园视觉主题，简洁、未来感、3D + 粒子特效，靠克制的动效和材质感取胜
- **品牌延续**：保留绿色作为签名色，但从草绿升级为青绿色系（#5EEAD4），质感提升
- **日夜双模式**：夜间深空冷调（默认），日间冰釉冷白，签名青绿色贯穿统一

## 2. 技术架构

### 新增依赖

| 包名 | 用途 |
|------|------|
| `three` | 3D 引擎核心 |
| `@react-three/fiber` | React 3D 渲染器 |
| `@react-three/drei` | R3F 辅助工具（Points 等） |
| `framer-motion` | 滚动动画、卡片渐入、视差效果、页面过渡 |

### 新增文件

| 文件 | 职责 |
|------|------|
| `src/components/ParticleField.tsx` | R3F 粒子场组件（首屏背景） |
| `src/components/SceneBackground.tsx` | 全局 3D 背景容器（fixed 定位） |
| `src/components/GlassCard.tsx` | 可复用玻璃拟态卡片基础组件 |
| `src/components/ScrollReveal.tsx` | 基于 framer-motion 的滚动渐入包装器 |
| `src/components/ThemeProvider.tsx` | 日夜模式切换，localStorage 持久化，prefers-color-scheme 检测 |
| `src/components/ThemeToggle.tsx` | Header 中的日/夜切换按钮 |

### 修改文件

| 文件 | 改动内容 |
|------|----------|
| `tailwind.config.ts` | 配色系统全面更新为 CSS 变量引用 |
| `src/app/globals.css` | CSS 变量定义（夜间/日间）、玻璃拟态工具类、动画 keyframes |
| `src/app/layout.tsx` | 挂载 SceneBackground + ThemeProvider |
| `src/app/page.tsx` | Hero 区域重构 + 卡片区域玻璃化 |
| `src/app/project/[id]/page.tsx` | 沉浸卡片流重构 |
| `src/components/ProjectCard.tsx` | 玻璃拟态改造 |
| `src/components/Header.tsx` | 悬浮玻璃导航 + 主题切换按钮 |
| `src/app/upload/page.tsx` | 表单玻璃化 |
| `src/app/_components/ProjectGallery.tsx` | 搜索栏玻璃化 + 布局调整 |
| `src/components/AiHotFeed.tsx` | 玻璃化适配 |

### SSR 兼容

所有 R3F 组件用 `next/dynamic` + `ssr: false` 动态导入，避免服务端渲染报错。粒子场只在客户端挂载。

### 性能降级

- 检测 `window.devicePixelRatio`，移动端粒子数从 3000 降到 800
- 检测 `prefers-reduced-motion`，开启时停止旋转和浮动，只保留静态粒子点阵
- 低端设备可完全跳过 3D，回退为静态渐变背景

## 3. 双模式配色系统

### 夜间模式（Night）— 深空冷调（默认）

| 角色 | 值 | 用途 |
|------|-----|------|
| 背景主色 | `#050709` | 近黑深空底色 |
| 背景次级 | `#0A0E14` | 卡片底色、层叠区域 |
| 背景三级 | `#11161F` | hover、表单输入框底色 |
| 边框 | `rgba(94, 234, 212, 0.12)` | 极细青绿透明边框 |
| 边框高亮 | `rgba(94, 234, 212, 0.4)` | hover/聚焦态边框 |
| 主文字 | `#F0F6FC` | 纯白偏冷 |
| 次文字 | `#8B9BB4` | 冷灰偏蓝 |
| 弱文字 | `#4A5568` | 深灰 |
| 签名强调色 | `#5EEAD4` | 主交互色、光效 |
| 强调色亮 | `#7FF5E0` | hover 态 |
| 强调色暗 | `#2DD4BF` | 按钮底色、进度条 |
| 玻璃底 | `rgba(10, 14, 20, 0.6)` | 毛玻璃面板 |
| 粒子色 | `#5EEAD4` / `#2DD4BF` / `#7FF5E0` | 青绿系混合 |

### 日间模式（Day）— 冰釉冷白

| 角色 | 值 | 用途 |
|------|-----|------|
| 背景主色 | `#F4F7FA` | 冰蓝白底，非纯白 |
| 背景次级 | `#FFFFFF` | 卡片纯白 |
| 背景三级 | `#EDF1F6` | hover、输入框 |
| 边框 | `rgba(45, 212, 191, 0.2)` | 青绿透明边框，日间稍浓 |
| 边框高亮 | `rgba(45, 212, 191, 0.5)` | hover/聚焦态 |
| 主文字 | `#0F172A` | 深蓝黑 |
| 次文字 | `#64748B` | slate 灰 |
| 弱文字 | `#94A3B8` | 浅灰 |
| 签名强调色 | `#14B8A6` | 青绿偏深，保证日间对比度 |
| 强调色亮 | `#0D9488` | hover 态 |
| 玻璃底 | `rgba(255, 255, 255, 0.7)` | 白色毛玻璃 |
| 粒子色 | `#14B8A6` / `#2DD4BF` / `#5EEAD4` | 青绿系，日间偏淡 |

### 功能状态色

| 状态 | 夜间 | 日间 |
|------|------|------|
| 红/低概率 | `#F87171` | `#DC2626` |
| 黄/中概率 | `#FBBF24` | `#D97706` |
| 绿/高概率 | `#34D399` | `#059669` |

### 玻璃拟态令牌

```css
--glass-bg: rgba(10, 14, 20, 0.6);       /* 夜间 */
--glass-bg: rgba(255, 255, 255, 0.7);    /* 日间 */
--glass-blur: 16px;
--glass-border: 1px solid rgba(94, 234, 212, 0.12);
--glass-glow: 0 0 20px rgba(94, 234, 212, 0.08);
--glass-hover-glow: 0 0 30px rgba(94, 234, 212, 0.15);
```

### 实现方式

所有颜色通过 CSS 变量定义。`:root` 为夜间（默认），`html.light` 类覆盖为日间。Tailwind 配置引用 CSS 变量而非硬编码值。

切换逻辑：
- `ThemeProvider` 读取 `localStorage` 中的用户偏好
- 无存储偏好时，跟随系统 `prefers-color-scheme`
- 无系统偏好时，默认夜间
- 切换时在 `<html>` 上增删 `light` 类
- 粒子场颜色读取 CSS 变量，切换时 300ms lerp 平滑过渡

### 字体

保留当前 system font stack。标题字重加粗到 700，字间距收紧 `-0.02em`，配合大字号营造"产品发布页"质感。

## 4. 首屏 Hero 区域 + 粒子场

### 布局

首屏占满 `100vh`，三层结构：

- **z-0：3D 粒子场**（fixed 全屏背景）
- **z-10：文字内容层**（居中对齐）
- **z-20：滚动指示器**（底部）

### 粒子场细节

- 数量：桌面端约 3000，移动端降级到 800
- 分布：3D 球形空间内随机分布，半径 8-15 单位
- 渲染：`Points` + 自定义 `shaderMaterial`，发光圆点，大小 0.02-0.05 随机
- 颜色：主色 `#5EEAD4` 混合，透明度 0.2-0.8 随机
- 运动：整体绕 Y 轴缓慢旋转（0.05 弧度/秒），每粒子 sin 波浮动
- 鼠标交互：粒子场视差倾斜（lerp 平滑），鼠标附近 2 单位范围粒子亮度提升
- 滚动响应：0-100vh 区间 opacity 从 1 渐变到 0.3

### 文字内容

- **主标题**：`PROJECT GRAVEYARD`，`text-6xl md:text-7xl`，字重 700，字间距 `-0.03em`，主文字色
- **中文副标题**：`项目墓园`，`text-xl md:text-2xl`，签名青绿色，字重 500
- **描述**：`让 AI 时代的烂尾项目被复活、拆件、展出或体面安葬`，`text-base`，次文字色，`max-w-xl` 居中
- **入场动画**：三行文字依次 fade-in-up，framer-motion stagger 0.15s 延迟

### CTA 按钮

- **主按钮**「浏览项目」：签名色填充背景，深色文字，hover 亮度提升 + glow
- **次按钮**「上传项目」：透明背景 + 青绿边框，hover 填充半透明青绿
- 并排居中，间距 16px

### 滚动指示器

底部居中，向下细线箭头 + `scroll` 文字，2s 循环上下浮动动画。

## 5. 项目卡片与列表区

### 玻璃拟态卡片

- 背景：`var(--glass-bg)` + `backdrop-blur: 16px`
- 边框：`1px solid rgba(94, 234, 212, 0.12)`
- 圆角：`rounded-xl`，内边距 `p-6`
- 顶部光线：`::before` 伪元素，1px 高度，青绿渐变（透明→60%→透明），默认 opacity 0.3

### Hover 效果

- 边框亮度提升到 `rgba(94, 234, 212, 0.4)`
- 顶部光线 opacity 到 1
- `box-shadow` 加入 `var(--glass-hover-glow)`（30px 青绿光晕）
- 卡片上浮 `translateY(-4px)`
- blur 从 16px 降到 8px（粒子透过度提升）

### 卡片内容

- 名称 + 完成度星级（SVG 星形，14px，填充青绿色 + 描边，空心为极淡边框）
- 墓志铭（斜体，签名色）
- 描述（line-clamp-2，次文字色）
- 技术栈标签（极淡边框）
- 阻塞点标签：小圆点（颜色对应阻塞类型）+ 文字，无边框
- 底部：日期 + 查看详情链接，顶部 1px 极淡分隔线

### 搜索栏

- 玻璃面板容器，flex 布局
- 搜索框带 SVG 搜索图标
- 两个筛选下拉，与玻璃面板融合
- focus 态：边框 + 微弱青绿 glow
- 计数文字移到面板下方，`text-xs`，弱文字色

### 网格布局

- 保持 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 间距增大到 `gap-6`
- 卡片入场：framer-motion stagger 渐入，opacity 0→1 + translateY 20px→0，每张延迟 0.05s

### 空状态

- 玻璃面板（去虚线边框）
- 中央极简几何线框图标
- 大标题 + 描述 + CTA 按钮（与 Hero 次按钮一致）

## 6. 详情页沉浸卡片流

### 结构

从线性堆叠改为多层玻璃卡片沉浸式滚动：

1. **推荐处理方式横幅**（首屏固定，签名色）
2. **项目头部卡片**（ScrollReveal 视差 +8px）
3. **AI 验尸报告卡片**（ScrollReveal 视差 -6px）
4. **烂尾原因 + 联系方式双列卡片**（ScrollReveal 视差 +4px）
5. **README 卡片**（ScrollReveal 视差 -8px）

### ScrollReveal 组件

- 基于 framer-motion `useInView` + `useScroll`
- 进入视口：opacity 0→1，translateY 30px→0，duration 0.6s
- 视差：`useTransform` 映射 scroll progress，幅度 ±10px，不同卡片不同方向

### 进度条升级

- **完成度**：青绿发光条，`box-shadow: 0 0 8px rgba(94, 234, 212, 0.5)`，轨道 `rgba(94, 234, 212, 0.08)`，`rounded-full h-2`
- **复活概率**：同发光样式，颜色编码：≥60% 绿 `#34D399`，≥40% 黄 `#FBBF24`，<40% 红 `#F87171`

### 墓志铭

- 左侧 2px 签名色光线
- 背景 `var(--glass-bg)` 轻微毛玻璃
- 斜体文字，次文字色
- 微弱青绿 glow

### 维度标签网格

- 玻璃拟态迷你卡片（每格独立 `var(--glass-bg)`）
- 标签弱文字色，值主文字色 + 字重 500
- 网格间距 `gap-3`
- hover 边框微亮

### README 代码块

- 外层玻璃卡片
- 内层背景比外层深一级
- 顶部窗口栏装饰：三个小圆点（青绿/灰/灰）
- 等宽字体保留

## 7. Header、Footer、上传页与 AI HOT

### Header

- 背景：`var(--glass-bg)` + `backdrop-blur: 20px`
- 去掉 `border-b`，改为底部极淡青绿渐变阴影线（1px，居中向两侧淡出）
- Logo 保留英文 + 中文小字
- 右侧：首页、上传项目、日/夜切换按钮（太阳/月亮 SVG）
- `sticky top-0 h-16`

### Footer

- 去掉 `border-t`，改为顶部极淡青绿渐变线
- 背景透明，粒子场透过
- 文字 `text-xs`，保留 `Powered by TRAE & 火山引擎`

### 上传页

- 外层 GlassCard 容器
- 输入框背景 `rgba(94, 234, 212, 0.04)`，边框 `rgba(94, 234, 212, 0.12)`，focus `rgba(94, 234, 212, 0.4)` + glow
- 必填标记 `*` 签名色
- 提交按钮：签名色填充，hover glow，loading 态青绿 SVG spinner
- 错误提示：红色玻璃面板（`rgba(248, 113, 113, 0.1)` 底 + 红色边框）

### AI HOT 区块

- 外层 GlassCard，闪烁圆点改签名青绿
- 资讯卡片改迷你玻璃面板
- hover 边框亮起青绿
- 横向滚动保留，滚动条青绿细条

### 页面过渡

- framer-motion `AnimatePresence`，页面切换淡入淡出 200ms
- 不过重转场，保持极简调性

## 8. 不在本次范围内

以下内容明确排除，避免范围蔓延：

- 用户登录系统（已有规划，非本次 UI 优化范畴）
- 个人中心页面
- 授权下载流程
- 移动端专项优化（仅做降级处理，不做移动端独立设计）
- 后端 API 改动
- 数据结构变更
