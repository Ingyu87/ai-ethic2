import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 윤리 탐험대 🤖",
  description: "AI 윤리를 배우는 스토리텔링 어드벤처 게임",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-700 text-center py-3 px-4">
          <a
            href="https://aiworld-ig.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-100 hover:text-white transition-colors"
          >
            © 2026 ingyu&apos;s AI world. All rights reserved.
          </a>
        </footer>
      </body>
    </html>
  );
}
