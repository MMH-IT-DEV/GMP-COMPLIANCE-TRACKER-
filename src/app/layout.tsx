import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/MainLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GMP Compliance Tracker - MyMagicHealer",
  description: "Internal tracking tool for Health Canada GMP compliance.",
};

import { DiscussionProvider } from "@/context/DiscussionContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-text-primary bg-background`}>
        <DiscussionProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </DiscussionProvider>
      </body>
    </html>
  );
}
