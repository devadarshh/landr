import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@/services/clerk/components/ClerkProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://landr.adarshsingh.xyz"),
  title: "Landr – AI Job Prep Platform",
  description:
    "Landr is an AI-powered platform for interview prep, resume feedback, and real-time emotion analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfitSans.variable} antialiased font-sans`}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
