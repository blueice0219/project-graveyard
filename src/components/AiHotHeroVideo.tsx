"use client";

import { useState } from "react";

export default function AiHotHeroVideo() {
  const [loaded, setLoaded] = useState(false);

  const VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4";

  return (
    <div className="aihot-hero-video-wrapper">
      {/* CSS 渐变 fallback 背景 — 立即显示 */}
      <div className="aihot-hero-video-fallback" />
      <video
        className={`aihot-hero-video ${loaded ? "aihot-hero-video-loaded" : ""}`}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setLoaded(true)}
      />
    </div>
  );
}
