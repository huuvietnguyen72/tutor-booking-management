import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Navbar } from "@/shared/components/layout/navbar";
import Providers from "./providers";
import Footer from "@/shared/components/layout/footer";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: "Gia sư Online - Kết nối tri thức",
    template: "%s | Gia sư Online",
  },
  description:
    "Nền tảng kết nối phụ huynh và học sinh với đội ngũ gia sư trình độ cao cho mọi môn học.",
  keywords: ["gia sư", "dạy kèm", "học tập", "tutor", "booking"],
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground",
          inter.className,
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
