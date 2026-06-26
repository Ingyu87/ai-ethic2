import type { Metadata } from "next";
import Footer from "@/components/Footer";
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
        <Footer />
      </body>
    </html>
  );
}
