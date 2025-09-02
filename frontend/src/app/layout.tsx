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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/gslogo.png", sizes: "32x32", type: "image/png" },
      { url: "/gslogo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/gslogo.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/gslogo.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ganpatsingh.dev",
    title: "Ganpat Singh - Full Stack Developer Portfolio",
    description: "Portfolio website showcasing web development and AI projects by Ganpat Singh",
    siteName: "Ganpat Singh Portfolio",
    images: [
      {
        url: "/gslogo.png",
        width: 1200,
        height: 630,
        alt: "Ganpat Singh Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ganpat Singh - Full Stack Developer Portfolio",
    description: "Portfolio website showcasing web development and AI projects",
    creator: "@ganpatsingh",
    images: ["/gslogo.png"]
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/gslogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/gslogo.png" />
        <link rel="apple-touch-icon" href="/gslogo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="portfolio-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
