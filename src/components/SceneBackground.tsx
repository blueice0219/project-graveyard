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
