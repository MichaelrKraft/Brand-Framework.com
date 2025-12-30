import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Branding Advisor - Build Your Brand with Proven Frameworks",
  description: "AI-powered branding and content strategy advisor based on Caleb Ralston's methodology. Get personalized guidance and generate professional playbooks.",
  keywords: ["branding", "brand strategy", "content strategy", "personal brand", "Caleb Ralston"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
