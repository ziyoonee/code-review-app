import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  title: "CodeReview - Build Amazing Web Experiences",
  description: "Create stunning, modern web applications with Next.js 15, TypeScript, and Tailwind CSS. Fast, scalable, and beautifully designed.",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Web Development"],
  authors: [{ name: "CodeReview Team" }],
  creator: "CodeReview",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CodeReview - Build Amazing Web Experiences",
    description: "Create stunning, modern web applications with Next.js 15, TypeScript, and Tailwind CSS.",
    siteName: "CodeReview",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeReview - Build Amazing Web Experiences",
    description: "Create stunning, modern web applications with Next.js 15, TypeScript, and Tailwind CSS.",
    creator: "@codereview",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
