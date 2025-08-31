import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ThemeScript } from "@/components/ui/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ganpat Singh - Full Stack Developer Portfolio",
  description: "Portfolio website of Ganpat Singh, a Full Stack Developer & AI Enthusiast specializing in React, Next.js, and Machine Learning",
  keywords: ["Full Stack Developer", "React", "Next.js", "TypeScript", "AI", "Machine Learning", "Portfolio", "Ganpat Singh"],
  authors: [{ name: "Ganpat Singh" }],
  creator: "Ganpat Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ganpatsingh.dev",
    title: "Ganpat Singh - Full Stack Developer Portfolio",
    description: "Portfolio website showcasing web development and AI projects by Ganpat Singh",
    siteName: "Ganpat Singh Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ganpat Singh - Full Stack Developer Portfolio",
    description: "Portfolio website showcasing web development and AI projects",
    creator: "@ganpatsingh"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="portfolio-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
