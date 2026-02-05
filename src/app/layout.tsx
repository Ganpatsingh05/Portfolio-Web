import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/ui/ThemeProvider";
import { ThemeScript } from "@/app/components/ui/ThemeScript";
import { QueryProvider } from "@/lib/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetching for backend */}
        <link rel="dns-prefetch" href="https://portfolio-web-gsr.onrender.com" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/gslogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/gslogo.png" />
        <link rel="apple-touch-icon" href="/gslogo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className="antialiased bg-white dark:bg-gray-900"
        style={{
          fontFamily: 'var(--font-geist-sans, Inter, system-ui, arial, sans-serif)',
        }}
      >
        <QueryProvider>
          <ThemeProvider
            defaultTheme="light"
            storageKey="portfolio-theme"
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
