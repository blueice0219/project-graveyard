"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const HLS_URL =
      "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

    let hls: any = null;

    const handleLoaded = () => {
      setLoaded(true);
    };

    // Dynamic import to avoid SSR issues
    import("hls.js").then((HlsModule) => {
      if (HlsModule.default && HlsModule.default.isSupported()) {
        hls = new HlsModule.default({ enableWorker: false });
        hls.loadSource(HLS_URL);
        hls.attachMedia(video);
        hls.on(HlsModule.default.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(HlsModule.default.Events.FRAG_LOADED, () => {
          // 第一片视频加载完成，触发淡入
          if (!loaded) setLoaded(true);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_URL;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(() => {});
          setLoaded(true);
        });
      }
    });

    // 备用：如果 3 秒内视频还没加载出来，也触发淡入（显示渐变背景 + 视频后续淡入）
    const fallbackTimer = setTimeout(() => {
      setLoaded(true);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      if (hls) hls.destroy();
    };
  }, [loaded]);

  return (
    <div className="hero-video-wrapper">
      {/* CSS 渐变 fallback 背景 — 立即显示，视频加载前不空白 */}
      <div className="hero-video-fallback" />
      <video
        ref={videoRef}
        className={`hero-video ${loaded ? "hero-video-loaded" : ""}`}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
