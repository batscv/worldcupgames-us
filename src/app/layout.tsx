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
    default: "WorldCupGames.us | Noticias da Copa do Mundo 2026",
    template: "%s | WorldCupGames.us",
  },
  description:
    "Noticias de futebol, Copa do Mundo 2026, resultados, calendario e cobertura editorial com CMS Supabase.",
  applicationName: "WorldCupGames.us",
  keywords: [
    "World Cup 2026",
    "noticias de futebol",
    "live scores",
    "football news",
    "resultados Copa do Mundo",
    "Copa do Mundo noticias",
  ],
  openGraph: {
    title: "WorldCupGames.us",
    description: "Noticias da Copa do Mundo 2026, futebol, calendario e resultados.",
    url: "https://worldcupgames.us",
    siteName: "WorldCupGames.us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldCupGames.us",
    description: "Noticias da Copa do Mundo 2026, futebol, calendario e resultados.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
