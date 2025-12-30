import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/MainLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GMP Compliance Tracker - MyMagicHealer",
  description: "Internal tracking tool for Health Canada GMP compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-text-primary bg-background`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
