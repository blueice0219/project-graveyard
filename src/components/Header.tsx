"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/upload", label: "上传项目" },
  { href: "/revive", label: "复活广场" },
  { href: "/ai-hot", label: "AI 热点资讯" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Bottom subtle gradient line — CodeNest style */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, var(--accent) 50%, transparent 95%)",
          opacity: 0.15,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Geometric mark */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: "var(--accent)",
                borderWidth: "1.5px",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono tracking-tight"
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              PROJECT_GRAVEYARD
            </span>
            <span
              className="text-xs hidden sm:inline"
              style={{ color: "var(--text-muted)" }}
            >
              项目墓园
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1.5 transition-colors"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {link.label}
                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 0 6px var(--accent)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Toggle menu"
          >
            {/* Hamburger / Close icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 lg:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg transition-colors"
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: isActive
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="block mt-1 mx-auto w-1 h-1 rounded-full"
                      style={{
                        background: "var(--accent)",
                        boxShadow: "0 0 6px var(--accent)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
