"use client";

import { useState, useCallback } from "react";
import QRCode from "qrcode";

interface TombstoneCardProps {
  projectName: string;
  epitaph: string;
  techStack: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export default function TombstoneCard({
  projectName,
  epitaph,
  techStack,
  createdAt,
  updatedAt,
  projectId,
}: TombstoneCardProps) {
  const [loading, setLoading] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "sharing" | "copied">(
    "idle"
  );

  /**
   * 生成墓碑卡片 canvas → 返回 Blob
   * 下载和分享共用这个函数
   */
  const generateCardBlob = useCallback(async (): Promise<Blob | null> => {
    // 1. 生成二维码 data URL
    const projectUrl = `${window.location.origin}/project/${projectId}`;
    const qrDataUrl = await QRCode.toDataURL(projectUrl, {
      width: 160,
      margin: 1,
      color: { dark: "#5EEAD4", light: "#0A0A0A" },
    });

    // 2. 创建 canvas
    const canvas = document.createElement("canvas");
    const W = 600;
    const H = 800;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 3. 背景 — 深色渐变
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#0F0F0F");
    bgGrad.addColorStop(1, "#1A1A2E");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 4. 边框 — 青绿色细线
    ctx.strokeStyle = "rgba(94, 234, 212, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // 5. 顶部标题 "PROJECT GRAVEYARD"
    ctx.fillStyle = "rgba(94, 234, 212, 0.6)";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PROJECT GRAVEYARD", W / 2, 55);

    // 装饰线
    ctx.strokeStyle = "rgba(94, 234, 212, 0.2)";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, 65);
    ctx.lineTo(W / 2 + 60, 65);
    ctx.stroke();

    // 6. 项目名 — 大字号
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px Inter, sans-serif";
    ctx.textAlign = "center";
    const nameLines = wrapText(ctx, projectName, W - 80);
    let y = 120;
    nameLines.forEach((line) => {
      ctx.fillText(line, W / 2, y);
      y += 42;
    });

    // 7. 生卒年月
    const birth = new Date(createdAt).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
    });
    const death = new Date(updatedAt).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
    });
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText(`${birth} — ${death}`, W / 2, y + 15);

    // 8. 墓志铭 — 中等字号，引号包裹，自动换行
    y += 60;
    ctx.fillStyle = "#5EEAD4";
    ctx.font = "italic 18px Inter, sans-serif";
    const epitaphText = `"${epitaph}"`;
    const epitaphLines = wrapText(ctx, epitaphText, W - 120);
    epitaphLines.forEach((line) => {
      ctx.fillText(line, W / 2, y);
      y += 28;
    });

    // 9. 技术栈 — 标签形式
    y += 30;
    const techList = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "left";
    let tagX = 60;
    let tagY = y;
    techList.slice(0, 6).forEach((tech) => {
      const metrics = ctx.measureText(tech);
      const tagWidth = metrics.width + 20;
      ctx.fillStyle = "rgba(94, 234, 212, 0.1)";
      ctx.fillRect(tagX, tagY - 14, tagWidth, 24);
      ctx.strokeStyle = "rgba(94, 234, 212, 0.3)";
      ctx.strokeRect(tagX, tagY - 14, tagWidth, 24);
      ctx.fillStyle = "rgba(94, 234, 212, 0.8)";
      ctx.fillText(tech, tagX + 10, tagY + 2);
      tagX += tagWidth + 8;
      if (tagX > W - 120) {
        tagX = 60;
        tagY += 32;
      }
    });

    // 10. 二维码 — 底部居中
    return new Promise<Blob | null>((resolve) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        const qrSize = 120;
        const qrX = (W - qrSize) / 2;
        const qrY = H - 180;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // 二维码下方文字
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("扫码查看遗产卡", W / 2, qrY + qrSize + 25);

        // 底部水印
        ctx.fillStyle = "rgba(94, 234, 212, 0.3)";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText("Powered by TRAE & 火山引擎", W / 2, H - 30);

        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      qrImg.onerror = () => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      qrImg.src = qrDataUrl;
    });
  }, [projectName, epitaph, techStack, createdAt, updatedAt, projectId]);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      const blob = await generateCardBlob();
      if (!blob) {
        setLoading(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}-墓碑卡片.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("生成卡片失败:", err);
    } finally {
      setLoading(false);
    }
  }, [generateCardBlob, projectName]);

  const handleShare = useCallback(async () => {
    setShareState("sharing");

    try {
      const blob = await generateCardBlob();
      if (!blob) {
        setShareState("idle");
        return;
      }

      const shareUrl = `${window.location.origin}/project/${projectId}`;
      const shareText = `${projectName} — "${epitaph}"\n\n在这个项目的墓园里看看它的遗产卡：`;

      // 尝试 Web Share API（支持图片分享）
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare
      ) {
        const file = new File([blob], `${projectName}-墓碑卡片.png`, {
          type: "image/png",
        });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${projectName} · 项目墓园`,
            text: shareText,
            url: shareUrl,
            files: [file],
          });
          setShareState("idle");
          return;
        }

        // 不支持文件分享，仅分享链接
        await navigator.share({
          title: `${projectName} · 项目墓园`,
          text: shareText,
          url: shareUrl,
        });
        setShareState("idle");
        return;
      }

      // 兜底：复制链接到剪贴板
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } catch (err) {
      // 用户取消分享不算错误
      if (err instanceof Error && err.name === "AbortError") {
        setShareState("idle");
        return;
      }
      // 兜底：复制链接
      try {
        const shareUrl = `${window.location.origin}/project/${projectId}`;
        await navigator.clipboard.writeText(shareUrl);
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 2000);
      } catch {
        setShareState("idle");
      }
    }
  }, [generateCardBlob, projectName, epitaph, projectId]);

  return (
    <div className="flex items-center gap-2">
      {/* 下载墓碑卡片 */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all hover:border-accent disabled:opacity-50"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        {loading ? (
          <>
            <svg
              className="spin-loading"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            生成中...
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载墓碑卡片
          </>
        )}
      </button>

      {/* 分享墓碑卡片 */}
      <button
        onClick={handleShare}
        disabled={shareState === "sharing"}
        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all disabled:opacity-50"
        style={{
          borderColor:
            shareState === "copied" ? "var(--status-green)" : "var(--border)",
          color:
            shareState === "copied"
              ? "var(--status-green)"
              : "var(--text-muted)",
        }}
      >
        {shareState === "sharing" ? (
          <>
            <svg
              className="spin-loading"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            分享中...
          </>
        ) : shareState === "copied" ? (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            链接已复制
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            分享
          </>
        )}
      </button>
    </div>
  );
}

// 文本换行辅助函数
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const chars = text.split("");
  const lines: string[] = [];
  let currentLine = "";
  for (const char of chars) {
    const testLine = currentLine + char;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
