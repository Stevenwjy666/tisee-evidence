import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tisee Travel",
  description: "A local travel discovery homepage for Tibet routes, stays, and experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
