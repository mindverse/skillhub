import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const BASE_URL = "https://skillhub.cool";

export const metadata: Metadata = {
  title: "技能宝 SkillHub — AI 技能搜索引擎 | 搜索 5000+ AI Skill",
  description:
    "全网最大中文 AI Skill 搜索引擎。收录 5000+ 技能，中文搜索，安全评级，一键安装。支持 Claude Code、Cursor 等 42 个平台。",
  keywords:
    "技能宝,skill hub,AI技能搜索,claude code skill,ai skill,ai技能,skill搜索引擎,cursor skill,技能市场",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "技能宝 SkillHub — AI 技能搜索引擎",
    description:
      "全网最大中文 AI Skill 搜索引擎。收录 5000+ 技能，中文搜索，安全评级，一键安装。",
    url: BASE_URL,
    siteName: "技能宝 SkillHub",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "技能宝 SkillHub — AI 技能搜索引擎",
    description:
      "全网最大中文 AI Skill 搜索引擎。收录 5000+ 技能，中文搜索，安全评级，一键安装。",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
