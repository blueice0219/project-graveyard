"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const HLS_URL =
      "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

    let hls: any = null;

    // Dynamic import to avoid SSR issues
    import("hls.js").then((HlsModule) => {
      if (HlsModule.default && HlsModule.default.isSupported()) {
        hls = new HlsModule.default({ enableWorker: false });
        hls.loadSource(HLS_URL);
        hls.attachMedia(video);
        hls.on(HlsModule.default.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = HLS_URL;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(() => {});
        });
      }
    });

    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
