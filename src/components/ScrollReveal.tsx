"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  parallax?: number;
  delay?: number;
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
