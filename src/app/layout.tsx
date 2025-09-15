import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/services/clerk/components/AppProvider";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Landr – AI Job Prep Platform",
  description:
    "Landr is an AI-powered platform for interview prep, resume feedback, and real-time emotion analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfitSans.variable} antialiased font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
