import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://worldcupgames.us"),
  title: {
    default: "WorldCupGames.us | World Cup 2026 News, Fixtures and Results",
    template: "%s | WorldCupGames.us",
  },
  description:
    "World Cup 2026 news, fixtures, results and editorial coverage powered by Supabase.",
  applicationName: "WorldCupGames.us",
  keywords: [
    "World Cup 2026",
    "FIFA predictions",
    "live scores",
    "football news",
    "where to watch World Cup",
    "World Cup simulator",
  ],
  openGraph: {
    title: "WorldCupGames.us",
    description: "World Cup 2026 news, fixtures and results.",
    url: "https://worldcupgames.us",
    siteName: "WorldCupGames.us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldCupGames.us",
    description: "World Cup 2026 news, fixtures and results.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
