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
    default: "WorldCupGames.us | AI World Cup 2026 Predictions, News and Live Scores",
    template: "%s | WorldCupGames.us",
  },
  description:
    "Premium AI-powered FIFA World Cup 2026 platform for predictions, live match coverage, SEO news, brackets, watch guides and fan rankings.",
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
    description: "A next-generation World Cup 2026 platform powered by AI.",
    url: "https://worldcupgames.us",
    siteName: "WorldCupGames.us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldCupGames.us",
    description: "AI predictions, live coverage and premium World Cup 2026 experiences.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
