import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SceneBackground from "@/components/SceneBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <SceneBackground />
        <Header />
        <main className="relative z-10">
          {children}
        </main>
          <footer className="relative z-10 mt-20">
            <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16">
              {/* Epitaph quote */}
              <div className="text-center py-12">
                <p className="text-xl italic leading-relaxed max-w-lg mx-auto mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                  &quot;The code we write but never ship teaches us more than the code we ship but never improve.&quot;
                </p>
                <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Every developer, at 3 AM
                </p>
                <div className="w-16 h-px mx-auto mt-8" style={{ background: "var(--accent)", opacity: 0.4 }} />
              </div>
              {/* Bottom bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-8" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  © 2025 Project Graveyard
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  May their commits rest in peace
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
                  Powered by TRAE &amp; 火山引擎
                </span>
              </div>
            </div>
          </footer>
      </body>
    </html>
  );
}
