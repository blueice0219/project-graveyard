# UI 视觉优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Project Graveyard 从 GitHub 风格暗色主题升级为极简未来感设计，含 3D 粒子场、玻璃拟态卡片、日夜双模式、沉浸式详情页。

**Architecture:** CSS 变量驱动的双模式配色系统 + React Three Fiber 3D 粒子场 + framer-motion 动画/视差 + 可复用 GlassCard/ScrollReveal 组件。所有颜色通过 CSS 变量定义，Tailwind 引用变量而非硬编码。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, three, @react-three/fiber, @react-three/drei, framer-motion

**Spec:** `docs/superpowers/specs/2026-07-02-ui-visual-optimization-design.md`

---

## File Structure

### 新建文件

| 文件 | 职责 |
|------|------|
| `src/components/ThemeProvider.tsx` | 日夜模式 Context Provider，localStorage 持久化，prefers-color-scheme 检测 |
| `src/components/ThemeToggle.tsx` | Header 中的日/夜切换按钮（太阳/月亮 SVG） |
| `src/components/GlassCard.tsx` | 可复用玻璃拟态卡片基础组件 |
| `src/components/ScrollReveal.tsx` | 基于 framer-motion 的滚动渐入 + 视差包装器 |
| `src/components/ParticleField.tsx` | R3F 3D 粒子场组件 |
| `src/components/SceneBackground.tsx` | 全局 3D 背景容器，dynamic import ParticleField |

### 修改文件

| 文件 | 改动 |
|------|------|
| `package.json` | 新增 three, @react-three/fiber, @react-three/drei, framer-motion |
| `tailwind.config.ts` | colors 改为 CSS 变量引用，新增 backdropBlur 配置 |
| `src/app/globals.css` | CSS 变量（夜间/日间）、玻璃工具类、新动画 keyframes |
| `src/app/layout.tsx` | 挂载 ThemeProvider + SceneBackground，更新 Footer |
| `src/components/Header.tsx` | 玻璃化 + 主题切换按钮 |
| `src/app/page.tsx` | Hero 区域重构 + 卡片区调整 |
| `src/components/ProjectCard.tsx` | 玻璃拟态改造 |
| `src/app/_components/ProjectGallery.tsx` | 搜索栏玻璃化 + 布局调整 |
| `src/app/project/[id]/page.tsx` | 沉浸卡片流重构 |
| `src/app/upload/page.tsx` | 表单玻璃化 |
| `src/components/AiHotFeed.tsx` | 玻璃化适配 |
| `src/types/index.ts` | BLOCKER_TYPES color 值更新为青绿系 dot 样式 |

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 3D 和动画依赖**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npm install three @react-three/fiber @react-three/drei framer-motion
```

- [ ] **Step 2: 安装 TypeScript 类型**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npm install -D @types/three
```

- [ ] **Step 3: 验证安装**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && node -e "console.log(require('./package.json').dependencies)"
```
Expected: 输出包含 `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`

---

## Task 2: 配色系统 — CSS 变量与 globals.css

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: 重写 globals.css**

Replace the entire content of `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== 夜间模式（默认）===== */
:root {
  --bg-primary: #050709;
  --bg-secondary: #0A0E14;
  --bg-tertiary: #11161F;
  --border: rgba(94, 234, 212, 0.12);
  --border-hover: rgba(94, 234, 212, 0.4);
  --text-primary: #F0F6FC;
  --text-secondary: #8B9BB4;
  --text-muted: #4A5568;
  --accent: #5EEAD4;
  --accent-bright: #7FF5E0;
  --accent-dim: #2DD4BF;
  --glass-bg: rgba(10, 14, 20, 0.6);
  --glass-blur: 16px;
  --glass-border: 1px solid rgba(94, 234, 212, 0.12);
  --glass-glow: 0 0 20px rgba(94, 234, 212, 0.08);
  --glass-hover-glow: 0 0 30px rgba(94, 234, 212, 0.15);
  --input-bg: rgba(94, 234, 212, 0.04);
  --code-bg: #050709;
  --particle-1: #5EEAD4;
  --particle-2: #2DD4BF;
  --particle-3: #7FF5E0;
  --status-red: #F87171;
  --status-yellow: #FBBF24;
  --status-green: #34D399;
}

/* ===== 日间模式 ===== */
html.light {
  --bg-primary: #F4F7FA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #EDF1F6;
  --border: rgba(45, 212, 191, 0.2);
  --border-hover: rgba(45, 212, 191, 0.5);
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --accent: #14B8A6;
  --accent-bright: #0D9488;
  --accent-dim: #2DD4BF;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: 1px solid rgba(45, 212, 191, 0.2);
  --glass-glow: 0 0 20px rgba(20, 184, 166, 0.06);
  --glass-hover-glow: 0 0 30px rgba(20, 184, 166, 0.12);
  --input-bg: rgba(45, 212, 191, 0.04);
  --code-bg: #F0F4F8;
  --particle-1: #14B8A6;
  --particle-2: #2DD4BF;
  --particle-3: #5EEAD4;
  --status-red: #DC2626;
  --status-yellow: #D97706;
  --status-green: #059669;
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-dim);
}

/* ===== 玻璃拟态工具类 ===== */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent),
    transparent
  );
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.glass-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--glass-hover-glow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-card:hover::before {
  opacity: 1;
}

.glass-input {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.glass-input:focus {
  border-color: var(--border-hover);
  box-shadow: 0 0 12px rgba(94, 234, 212, 0.1);
  outline: none;
}

.glass-input::placeholder {
  color: var(--text-muted);
}

/* ===== 动画 ===== */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.pulse-dot {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
.scroll-indicator {
  animation: bounce-arrow 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin-loading {
  animation: spin 0.8s linear infinite;
}

/* ===== 链接 ===== */
a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  color: var(--accent-bright);
}

/* ===== 发光进度条 ===== */
.glow-bar {
  box-shadow: 0 0 8px rgba(94, 234, 212, 0.5);
}

/* 主题切换过渡 */
.theme-transition * {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
```

- [ ] **Step 2: 更新 tailwind.config.ts**

Replace the entire content of `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          bright: "var(--accent-bright)",
          dim: "var(--accent-dim)",
        },
        status: {
          red: "var(--status-red)",
          yellow: "var(--status-yellow)",
          green: "var(--status-green)",
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backdropBlur: {
        glass: "16px",
        header: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: 验证编译**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -20
```
Expected: 无类型错误（可能有已有文件的样式警告，忽略非 tailwind/css 相关错误）

---

## Task 3: ThemeProvider 与 ThemeToggle 组件

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: 创建 ThemeProvider.tsx**

Create `src/components/ThemeProvider.tsx`:

```tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "night" | "day";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      setTheme("day");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "day") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

- [ ] **Step 2: 创建 ThemeToggle.tsx**

Create `src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "night" ? "切换到日间模式" : "切换到夜间模式"}
      className="p-2 rounded-lg text-text-secondary hover:text-accent transition-colors"
    >
      {theme === "night" ? (
        // 太阳图标
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // 月亮图标
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 3: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | grep -E "ThemeProvider|ThemeToggle" | head -5
```
Expected: 无输出（无错误）

---

## Task 4: GlassCard 与 ScrollReveal 组件

**Files:**
- Create: `src/components/GlassCard.tsx`
- Create: `src/components/ScrollReveal.tsx`

- [ ] **Step 1: 创建 GlassCard.tsx**

Create `src/components/GlassCard.tsx`:

```tsx
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div className={`glass-card ${hover ? "cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: 创建 ScrollReveal.tsx**

Create `src/components/ScrollReveal.tsx`:

```tsx
"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  parallax?: number; // 视差幅度，正值向下偏移，负值向上，默认 0
  delay?: number; // 渐入延迟，默认 0
}

export default function ScrollReveal({
  children,
  className = "",
  parallax = 0,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <motion.div
      ref={ref}
      style={{ y: parallax !== 0 ? y : undefined }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | grep -E "GlassCard|ScrollReveal" | head -5
```
Expected: 无输出

---

## Task 5: ParticleField 与 SceneBackground 组件

**Files:**
- Create: `src/components/ParticleField.tsx`
- Create: `src/components/SceneBackground.tsx`

- [ ] **Step 1: 创建 ParticleField.tsx**

Create `src/components/ParticleField.tsx`:

```tsx
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 读取 CSS 变量获取粒子颜色
function getParticleColors(): THREE.Color[] {
  if (typeof window === "undefined") {
    return [
      new THREE.Color("#5EEAD4"),
      new THREE.Color("#2DD4BF"),
      new THREE.Color("#7FF5E0"),
    ];
  }
  const styles = getComputedStyle(document.documentElement);
  return [
    new THREE.Color(styles.getPropertyValue("--particle-1").trim() || "#5EEAD4"),
    new THREE.Color(styles.getPropertyValue("--particle-2").trim() || "#2DD4BF"),
    new THREE.Color(styles.getPropertyValue("--particle-3").trim() || "#7FF5E0"),
  ];
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 生成粒子位置和颜色
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = getParticleColors();

    for (let i = 0; i < count; i++) {
      // 球形分布，半径 8-15
      const radius = 8 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 随机选一个颜色
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // 粒子大小 0.02-0.05
      sizes[i] = 0.02 + Math.random() * 0.03;
    }

    return { positions, colors, sizes };
  }, [count]);

  // 鼠标跟踪
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // 缓慢旋转
    pointsRef.current.rotation.y += delta * 0.05;

    // 鼠标视差
    const targetX = state.mouse.x * 0.3;
    const targetY = state.mouse.y * 0.3;
    mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
    pointsRef.current.rotation.x = mouseRef.current.y * 0.2;
    pointsRef.current.rotation.z = mouseRef.current.x * 0.1;
  });

  // 自定义 shader 让粒子是发光圆点
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          // sin 波浮动
          pos.y += sin(time * 0.5 + position.x * 0.5) * 0.3;
          pos.x += cos(time * 0.3 + position.z * 0.5) * 0.2;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * 300.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // 圆形粒子，边缘柔和
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // 更新 time uniform
  useFrame((state) => {
    shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  // 检测 reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} />
      {prefersReducedMotion && pointsRef.current
        ? (pointsRef.current.rotation.y = 0)
        : null}
    </points>
  );
}

export default function ParticleField() {
  // 粒子数量：桌面 3000，移动端 800
  const count =
    typeof window !== "undefined" &&
    (window.devicePixelRatio > 1.5 || window.innerWidth < 768)
      ? 800
      : 3000;

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <Particles count={count} />
    </Canvas>
  );
}
```

- [ ] **Step 2: 创建 SceneBackground.tsx**

Create `src/components/SceneBackground.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => null,
});

export default function SceneBackground() {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // 0-100vh 区间 opacity 从 1 渐变到 0.3
      const scrolled = window.scrollY;
      const vh = window.innerHeight;
      const opacity = Math.max(0.3, 1 - (scrolled / vh) * 0.7);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        opacity: scrollOpacity,
        transition: "opacity 0.1s linear",
      }}
    >
      <ParticleField />
    </div>
  );
}
```

- [ ] **Step 3: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | grep -E "ParticleField|SceneBackground" | head -5
```
Expected: 无输出

---

## Task 6: 更新 layout.tsx — 挂载 Provider 与背景

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 重写 layout.tsx**

Replace the entire content of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import SceneBackground from "@/components/SceneBackground";

export const metadata: Metadata = {
  title: "Project Graveyard / 项目墓园",
  description: "Vibe Coder 的烂尾项目开源认领社区 — 让 AI 时代的半成品项目被复活、拆件、展出或体面安葬",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SceneBackground />
          <Header />
          <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="relative z-10 mt-16">
            <div
              className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-text-muted"
              style={{
                borderTop: "1px solid var(--border)",
              }}
            >
              <p>Project Graveyard / 项目墓园</p>
              <p className="mt-1">
                让每个半成品项目都有机会被复活、拆件、合并、展出或体面安葬
              </p>
              <p className="mt-2 text-xs opacity-60">
                Powered by TRAE &amp; 火山引擎
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 7: 更新 Header.tsx — 玻璃导航 + 主题切换

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: 重写 Header.tsx**

Replace the entire content of `src/components/Header.tsx` with:

```tsx
"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* 底部极淡青绿渐变线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.3,
        }}
      />
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左侧 Logo */}
        <Link href="/" className="flex items-baseline gap-2 group">
          <span
            className="text-xl font-bold tracking-tight transition-colors group-hover:text-accent"
            style={{ color: "var(--text-primary)" }}
          >
            Project Graveyard
          </span>
          <span className="text-sm text-text-secondary hidden sm:inline">
            项目墓园
          </span>
        </Link>

        {/* 右侧导航 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            首页
          </Link>
          <Link
            href="/upload"
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            上传项目
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | grep "Header" | head -5
```
Expected: 无输出

---

## Task 8: 重构首页 page.tsx — Hero 区域 + 粒子场

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 重写 page.tsx**

Replace the entire content of `src/app/page.tsx` with:

```tsx
import type { ProjectData } from "@/types";
import { getAllProjects } from "@/lib/db";
import AiHotFeed from "@/components/AiHotFeed";
import ProjectGallery from "./_components/ProjectGallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = getAllProjects();

  const serialized: ProjectData[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    readme: p.readme,
    techStack: p.techStack,
    abandonReason: p.abandonReason,
    contactInfo: p.contactInfo,
    licenseType: p.licenseType,
    scoreCompletion: p.scoreCompletion,
    scoreClarity: p.scoreClarity,
    scoreBlockerType: p.scoreBlockerType,
    scoreReusability: p.scoreReusability,
    scoreDocLevel: p.scoreDocLevel,
    scoreUserValue: p.scoreUserValue,
    revivalProbability: p.revivalProbability,
    recommendedAction: p.recommendedAction,
    aiAnalysis: p.aiAnalysis,
    aiEpitaph: p.aiEpitaph,
    status: p.status,
    createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date(p.createdAt).toISOString(),
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : new Date(p.updatedAt).toISOString(),
  }));

  return (
    <div className="space-y-16">
      {/* ===== Hero 区域 ===== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6 fade-in-up">
          {/* 主标题 */}
          <h1
            className="text-5xl font-bold tracking-tight md:text-7xl"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            PROJECT GRAVEYARD
          </h1>

          {/* 中文副标题 */}
          <p
            className="text-xl md:text-2xl font-medium"
            style={{ color: "var(--accent)" }}
          >
            项目墓园
          </p>

          {/* 描述 */}
          <p
            className="mx-auto max-w-xl text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            让 AI 时代的烂尾项目被复活、拆件、展出或体面安葬
          </p>

          {/* CTA 按钮 */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg"
              style={{
                background: "var(--accent)",
                color: "var(--bg-primary)",
              }}
            >
              浏览项目
            </a>
            <a
              href="/upload"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:bg-opacity-10"
              style={{
                background: "transparent",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
              }}
            >
              上传项目
            </a>
          </div>
        </div>

        {/* 滚动指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              scroll
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)" }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== 项目列表区 ===== */}
      <div id="projects">
        <ProjectGallery projects={serialized} />
      </div>

      {/* ===== AI 热点资讯 ===== */}
      <section>
        <AiHotFeed />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 9: 更新 ProjectCard.tsx — 玻璃拟态改造

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/types/index.ts` (BLOCKER_TYPES color 值)

- [ ] **Step 1: 更新 types/index.ts 中 BLOCKER_TYPES 的 color 值**

In `src/types/index.ts`, replace the BLOCKER_TYPES constant:

```typescript
export const BLOCKER_TYPES: Record<string, { label: string; color: string; dot: string }> = {
  tech: { label: "技术阻塞", color: "text-status-red", dot: "var(--status-red)" },
  design: { label: "设计阻塞", color: "text-purple-400", dot: "#A78BFA" },
  product: { label: "产品阻塞", color: "text-status-yellow", dot: "var(--status-yellow)" },
  resource: { label: "资源阻塞", color: "text-blue-400", dot: "#60A5FA" },
  motivation: { label: "动力阻塞", color: "text-text-muted", dot: "var(--text-muted)" },
};
```

- [ ] **Step 2: 重写 ProjectCard.tsx**

Replace the entire content of `src/components/ProjectCard.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BLOCKER_TYPES } from "@/types";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  techStack: string;
  scoreCompletion: number;
  scoreBlockerType: string;
  aiEpitaph: string;
  createdAt: string;
}

export default function ProjectCard({
  id,
  name,
  description,
  techStack,
  scoreCompletion,
  scoreBlockerType,
  aiEpitaph,
  createdAt,
}: ProjectCardProps) {
  const starCount = Math.max(0, Math.min(5, Math.round(scoreCompletion / 20)));

  const techList = techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const blocker = BLOCKER_TYPES[scoreBlockerType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/project/${id}`} className="block h-full">
        <div className="glass-card p-6 h-full flex flex-col">
          {/* 顶部：项目名称 + 完成度星级 */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className="text-lg font-bold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              {name}
            </h3>
            <div
              className="flex items-center gap-0.5 shrink-0"
              title={`完成度 ${scoreCompletion}%`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={i < starCount ? "var(--accent)" : "none"}
                  stroke={i < starCount ? "var(--accent)" : "var(--border)"}
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>

          {/* 墓志铭 */}
          {aiEpitaph && (
            <p
              className="italic text-sm mb-4 leading-relaxed"
              style={{ color: "var(--accent)" }}
            >
              &ldquo;{aiEpitaph}&rdquo;
            </p>
          )}

          {/* 描述 */}
          {description && (
            <p
              className="text-sm mb-4 leading-relaxed line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {description}
            </p>
          )}

          {/* 技术栈标签 */}
          {techList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {techList.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* 阻塞点标签 */}
          {blocker && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: blocker.dot }}
                />
                <span style={{ color: "var(--text-secondary)" }}>
                  {blocker.label}
                </span>
              </span>
            </div>
          )}

          {/* 底部：日期 + 查看详情 */}
          <div
            className="flex items-center justify-between pt-3 mt-auto"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {new Date(createdAt).toLocaleDateString("zh-CN")}
            </span>
            <span
              className="text-sm transition-colors"
              style={{ color: "var(--accent)" }}
            >
              查看详情 →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

- [ ] **Step 3: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 10: 更新 ProjectGallery.tsx — 玻璃搜索栏

**Files:**
- Modify: `src/app/_components/ProjectGallery.tsx`

- [ ] **Step 1: 重写 ProjectGallery.tsx**

Replace the entire content of `src/app/_components/ProjectGallery.tsx` with:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectData } from "@/types";

const TECH_OPTIONS = ["全部", "React", "Vue", "Python", "Flutter", "Next.js"];

const BLOCKER_OPTIONS: { value: string; label: string }[] = [
  { value: "全部", label: "全部" },
  { value: "tech", label: "技术" },
  { value: "design", label: "设计" },
  { value: "product", label: "产品" },
  { value: "resource", label: "资源" },
  { value: "motivation", label: "动力" },
];

export default function ProjectGallery({
  projects,
}: {
  projects: ProjectData[];
}) {
  const [keyword, setKeyword] = useState("");
  const [tech, setTech] = useState("全部");
  const [blocker, setBlocker] = useState("全部");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return projects.filter((p) => {
      const matchKeyword =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.toLowerCase().includes(q);
      const matchTech =
        tech === "全部" ||
        p.techStack.toLowerCase().includes(tech.toLowerCase());
      const matchBlocker =
        blocker === "全部" || p.scoreBlockerType === blocker;
      return matchKeyword && matchTech && matchBlocker;
    });
  }, [projects, keyword, tech, blocker]);

  return (
    <section className="space-y-6">
      {/* 搜索栏 — 玻璃面板 */}
      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* 搜索框 */}
          <div className="sm:flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: "var(--text-muted)" }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索项目名称、描述或技术栈..."
              className="glass-input w-full pl-10 pr-3 py-2 text-sm"
            />
          </div>
          {/* 技术栈 */}
          <select
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="glass-input px-3 py-2 text-sm sm:w-40"
          >
            {TECH_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {/* 阻塞点 */}
          <select
            value={blocker}
            onChange={(e) => setBlocker(e.target.value)}
            className="glass-input px-3 py-2 text-sm sm:w-40"
          >
            {BLOCKER_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 计数 */}
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        共 {filtered.length} 个项目
      </div>

      {/* 列表 / 空状态 */}
      {projects.length === 0 ? (
        <EmptyState
          title="墓园里还很安静"
          desc="还没有项目被安葬在这里。去上传你的第一个烂尾项目，让 AI 为它写一份验尸报告吧。"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="没有匹配的项目"
          desc="试试调整搜索关键词，或切换技术栈 / 阻塞点筛选条件。"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* 极简几何线框图标 */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--text-muted)" }}
      >
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
      </svg>
      <h3
        className="mt-4 text-lg font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 max-w-md text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {desc}
      </p>
      <Link
        href="/upload"
        className="mt-6 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all"
        style={{
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          background: "rgba(94, 234, 212, 0.05)",
        }}
      >
        上传项目
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 11: 重构详情页 — 沉浸卡片流

**Files:**
- Modify: `src/app/project/[id]/page.tsx`

- [ ] **Step 1: 重写详情页 page.tsx**

Replace the entire content of `src/app/project/[id]/page.tsx` with:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import ScrollReveal from "@/components/ScrollReveal";
import {
  BLOCKER_TYPES,
  CLARITY_LEVELS,
  DOC_LEVELS,
  REUSABILITY_LEVELS,
  USER_VALUE_LEVELS,
  RECOMMENDED_ACTIONS,
} from "@/types";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const completion = Math.max(0, Math.min(100, project.scoreCompletion || 0));
  const revivalProb = Math.max(0, Math.min(100, project.revivalProbability || 0));

  const clarityLabel = CLARITY_LEVELS[project.scoreClarity] ?? "未知";
  const blocker = BLOCKER_TYPES[project.scoreBlockerType];
  const reusability = REUSABILITY_LEVELS[project.scoreReusability];
  const docLabel = DOC_LEVELS[project.scoreDocLevel] ?? "未知";
  const userValue = USER_VALUE_LEVELS[project.scoreUserValue];
  const action = RECOMMENDED_ACTIONS[project.recommendedAction];

  const techList = project.techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // 复活概率颜色
  const revivalColor =
    revivalProb >= 60
      ? "var(--status-green)"
      : revivalProb >= 40
      ? "var(--status-yellow)"
      : "var(--status-red)";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 返回首页 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm transition-colors hover:text-accent"
        style={{ color: "var(--text-secondary)" }}
      >
        ← 返回首页
      </Link>

      {/* 推荐处理方式横幅 */}
      {action && (
        <ScrollReveal>
          <div
            className="glass-card flex items-center gap-3 px-5 py-3"
            style={{ borderLeft: `3px solid var(--accent)` }}
          >
            <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {action.icon}
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {action.label}
            </span>
          </div>
        </ScrollReveal>
      )}

      {/* 项目头部 */}
      <ScrollReveal parallax={8}>
        <div className="glass-card p-6">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {project.name}
          </h1>
          <p
            className="mt-3"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.description}
          </p>
          {techList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {techList.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* AI 验尸报告 */}
      <ScrollReveal parallax={-6}>
        <div className="glass-card p-6">
          <h2
            className="mb-5 text-lg font-semibold"
            style={{ color: "var(--accent)" }}
          >
            AI 验尸报告
          </h2>

          {/* 双进度条 */}
          <div className="space-y-4">
            {/* 完成度 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>完成度</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {completion}%
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ background: "rgba(94, 234, 212, 0.08)" }}
              >
                <div
                  className="h-full rounded-full glow-bar transition-all"
                  style={{
                    width: `${completion}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>

            {/* 复活概率 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>复活概率</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {revivalProb}%
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ background: "rgba(94, 234, 212, 0.08)" }}
              >
                <div
                  className="h-full rounded-full glow-bar transition-all"
                  style={{
                    width: `${revivalProb}%`,
                    background: revivalColor,
                    boxShadow: `0 0 8px ${revivalColor}80`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 五个维度标签 */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ScoreItem label="目标清晰度" value={clarityLabel} />
            <ScoreItem
              label="阻塞点"
              value={blocker?.label ?? "未知"}
              dot={blocker?.dot}
            />
            <ScoreItem
              label="可复用价值"
              value={reusability?.label ?? "未知"}
            />
            <ScoreItem
              label="用户价值"
              value={userValue?.label ?? "未知"}
            />
            <ScoreItem label="文档完整度" value={docLabel} />
          </div>

          {/* AI 分析报告 */}
          {project.aiAnalysis && (
            <div className="mt-5">
              <div
                className="mb-1.5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                AI 分析报告
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {project.aiAnalysis}
              </p>
            </div>
          )}

          {/* 项目墓志铭 */}
          {project.aiEpitaph && (
            <blockquote
              className="mt-5 px-4 py-3"
              style={{
                borderLeft: "2px solid var(--accent)",
                background: "var(--glass-bg)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "0 0.5rem 0.5rem 0",
                boxShadow: "0 0 15px rgba(94, 234, 212, 0.05)",
              }}
            >
              <p
                className="italic text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.aiEpitaph}
              </p>
            </blockquote>
          )}
        </div>
      </ScrollReveal>

      {/* 烂尾原因 / 联系方式 + 协议 */}
      <ScrollReveal parallax={4}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="glass-card p-6">
            <h3
              className="mb-2 text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              烂尾原因
            </h3>
            <p
              className="whitespace-pre-wrap text-sm leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {project.abandonReason || "（未填写）"}
            </p>
          </div>
          <div className="glass-card p-6 space-y-4">
            <div>
              <h3
                className="mb-2 text-sm font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                联系方式
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {project.contactInfo || "（未填写）"}
              </p>
            </div>
            <div>
              <h3
                className="mb-2 text-sm font-semibold"
                style={{ color: "var(--text-secondary)" }}
              >
                开源协议
              </h3>
              <span
                className="rounded-md px-2.5 py-0.5 text-xs"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                {project.licenseType}
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* README */}
      {project.readme && (
        <ScrollReveal parallax={-8}>
          <div className="glass-card p-6">
            <h3
              className="mb-2 text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              README
            </h3>
            {/* 代码窗口栏 */}
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-t-md"
              style={{ background: "var(--code-bg)" }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--text-muted)" }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--text-muted)" }}
              />
            </div>
            <pre
              className="overflow-x-auto whitespace-pre-wrap rounded-b-md p-4 font-mono text-sm"
              style={{
                background: "var(--code-bg)",
                color: "var(--text-primary)",
                borderTop: "1px solid var(--border)",
              }}
            >
              {project.readme}
            </pre>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

// 单个评分维度行 — 玻璃迷你卡片
function ScoreItem({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot?: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-md px-3 py-2 transition-all hover:border-hover"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <span className="flex items-center gap-1.5">
        {dot && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: dot }}
          />
        )}
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </span>
      </span>
    </div>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 12: 更新上传页 — 玻璃表单

**Files:**
- Modify: `src/app/upload/page.tsx`

- [ ] **Step 1: 重写 upload/page.tsx**

Replace the entire content of `src/app/upload/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LICENSE_OPTIONS = ["MIT", "Apache-2.0", "GPL-3.0", "CC0", "自定义"];

interface UploadForm {
  name: string;
  description: string;
  techStack: string;
  abandonReason: string;
  readme: string;
  contactInfo: string;
  licenseType: string;
}

const initialForm: UploadForm = {
  name: "",
  description: "",
  techStack: "",
  abandonReason: "",
  readme: "",
  contactInfo: "",
  licenseType: "MIT",
};

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState<UploadForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof UploadForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `提交失败（HTTP ${res.status}）`);
      }

      const data = (await res.json()) as { id: string };
      router.push(`/project/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* 标题 */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          安葬一个项目
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          填写项目信息，提交后将由 AI 验尸官生成评分报告与墓志铭。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6">
        {/* 项目名称 */}
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
            htmlFor="name"
          >
            项目名称 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="例如：今天吃什么推荐器"
            className="glass-input w-full px-3 py-2 text-sm"
          />
        </div>

        {/* 一句话描述 */}
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
            htmlFor="description"
          >
            一句话描述 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="description"
            type="text"
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="用一句话说清这个项目想做什么"
            className="glass-input w-full px-3 py-2 text-sm"
          />
        </div>

        {/* 技术栈 */}
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
            htmlFor="techStack"
          >
            技术栈 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="techStack"
            type="text"
            required
            value={form.techStack}
            onChange={(e) => update("techStack", e.target.value)}
            placeholder="逗号分隔，例如：React, Next.js, TailwindCSS"
            className="glass-input w-full px-3 py-2 text-sm"
          />
        </div>

        {/* 烂尾原因 */}
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
            htmlFor="abandonReason"
          >
            烂尾原因 <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <textarea
            id="abandonReason"
            required
            rows={4}
            value={form.abandonReason}
            onChange={(e) => update("abandonReason", e.target.value)}
            placeholder="为什么会烂尾？卡在哪里了？越详细，AI 验尸越准。"
            className="glass-input w-full px-3 py-2 text-sm resize-y"
          />
        </div>

        {/* README 内容 */}
        <div>
          <label
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
            htmlFor="readme"
          >
            README 内容{" "}
            <span style={{ color: "var(--text-muted)" }}>（选填）</span>
          </label>
          <textarea
            id="readme"
            rows={6}
            value={form.readme}
            onChange={(e) => update("readme", e.target.value)}
            placeholder="粘贴项目的 README，帮助 AI 评估文档完整度与可复用资产。"
            className="glass-input w-full px-3 py-2 text-sm resize-y font-mono text-xs"
          />
        </div>

        {/* 联系方式 + 开源协议 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              htmlFor="contactInfo"
            >
              联系方式{" "}
              <span style={{ color: "var(--text-muted)" }}>（选填）</span>
            </label>
            <input
              id="contactInfo"
              type="text"
              value={form.contactInfo}
              onChange={(e) => update("contactInfo", e.target.value)}
              placeholder="GitHub 用户名或邮箱，方便认领"
              className="glass-input w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
              htmlFor="licenseType"
            >
              开源协议
            </label>
            <select
              id="licenseType"
              value={form.licenseType}
              onChange={(e) => update("licenseType", e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm"
            >
              {LICENSE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div
            className="rounded-md px-3 py-2 text-sm"
            style={{
              border: "1px solid rgba(248, 113, 113, 0.3)",
              background: "rgba(248, 113, 113, 0.1)",
              color: "var(--status-red)",
            }}
          >
            {error}
          </div>
        )}

        {/* 操作区 */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--accent)",
              color: "var(--bg-primary)",
            }}
          >
            {loading && (
              <svg
                className="spin-loading"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {loading ? "正在生成 AI 验尸报告..." : "提交并生成 AI 验尸报告"}
          </button>
          <Link
            href="/"
            className="text-sm transition-colors hover:text-text-primary"
            style={{ color: "var(--text-secondary)" }}
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 13: 更新 AiHotFeed.tsx — 玻璃化适配

**Files:**
- Modify: `src/components/AiHotFeed.tsx`

- [ ] **Step 1: 重写 AiHotFeed.tsx**

Replace the entire content of `src/components/AiHotFeed.tsx` with:

```tsx
import { AiHotItem } from "@/types";

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "未知时间";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  return date.toLocaleDateString("zh-CN");
}

/**
 * AI 热点资讯区块（Server Component）
 * 直接从 AI HOT API 获取数据（不走内部代理，兼容 serverless 部署）
 */
export default async function AiHotFeed() {
  let items: AiHotItem[] = [];

  try {
    const res = await fetch(
      "https://aihot.virxact.com/api/public/items?mode=selected&take=8",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0",
        },
        next: { revalidate: 1800 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    items = Array.isArray(data?.items) ? data.items : [];
  } catch {
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-block w-2 h-2 rounded-full pulse-dot"
          style={{ background: "var(--accent)" }}
        />
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          AI 热点资讯
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-72 rounded-lg p-4 transition-all hover:border-hover"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <h3
              className="text-sm font-medium line-clamp-2 mb-2 leading-snug transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="group-hover:text-accent">{item.title}</span>
            </h3>
            <div
              className="flex items-center justify-between text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                {item.source}
              </span>
              <span>{relativeTime(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 验证类型检查**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npx tsc --noEmit 2>&1 | head -10
```
Expected: 无错误

---

## Task 14: 全量构建验证

**Files:** 无文件改动

- [ ] **Step 1: 运行 Next.js 构建**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npm run build 2>&1 | tail -30
```
Expected: 构建成功，无错误。如果有类型错误，根据错误信息修复对应文件。

- [ ] **Step 2: 启动本地 dev server 验证**

Run:
```bash
cd "/Users/vincent/Library/Application Support/TRAE SOLO CN/ModularData/ai-agent/work-mode-projects/6a43257464ac21e9d7a285f0/project-graveyard" && npm run dev
```
Expected: 服务器在 localhost:3000 启动，无运行时错误

- [ ] **Step 3: 浏览器手动验证清单**

打开 `http://localhost:3000`，逐项检查：

1. **首页 Hero**：3D 粒子场可见、标题渐入动画、CTA 按钮可点击、滚动指示器浮动
2. **主题切换**：Header 右上角太阳/月亮按钮可切换，切换后配色变化、刷新后保持
3. **项目卡片**：玻璃拟态效果、hover 有 glow 和上浮、星级 SVG 渲染、阻塞点小圆点
4. **搜索栏**：玻璃面板、搜索图标、下拉框样式、筛选功能正常
5. **详情页**：ScrollReveal 渐入、进度条发光、墓志铭玻璃块、维度标签迷你卡片、README 窗口栏
6. **上传页**：玻璃表单、输入框 focus glow、提交按钮 loading spinner
7. **AI HOT**：玻璃面板、资讯卡片玻璃化、横向滚动
8. **Footer**：透明背景、粒子透过、顶部青绿渐变线

- [ ] **Step 4: 修复发现的问题**

如有任何视觉或功能问题，逐个修复后重新验证。
