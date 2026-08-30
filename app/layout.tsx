import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/hooks/useSettings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElderGuard AI — AI-Powered Scam Call Protection",
  description:
    "Real-time AI-powered scam detection and protection designed for elderly users. Listen. Detect. Protect.",
  keywords: ["scam protection", "elderly safety", "AI call protection", "OTP scam", "voice fraud detection"],
  openGraph: {
    title: "ElderGuard AI — AI-Powered Scam Call Protection",
    description:
      "Real-time AI-powered scam detection and protection designed for elderly users.",
    type: "website",
    siteName: "ElderGuard AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElderGuard AI",
    description: "Protecting elderly users from voice-based scam calls using AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
