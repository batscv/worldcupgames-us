import {
  Activity,
  BadgeDollarSign,
  Bell,
  ChartNoAxesCombined,
  Globe2,
  Newspaper,
  Radio,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export const teams = [
  { name: "United States", code: "USA", flag: "🇺🇸", rating: 83, form: "W-D-W-W-L" },
  { name: "Brazil", code: "BRA", flag: "🇧🇷", rating: 92, form: "W-W-D-W-W" },
  { name: "France", code: "FRA", flag: "🇫🇷", rating: 91, form: "W-W-W-D-L" },
  { name: "Argentina", code: "ARG", flag: "🇦🇷", rating: 90, form: "W-D-W-L-W" },
  { name: "England", code: "ENG", flag: "🏴", rating: 88, form: "D-W-W-W-D" },
  { name: "Mexico", code: "MEX", flag: "🇲🇽", rating: 81, form: "L-W-D-W-D" },
  { name: "Japan", code: "JPN", flag: "🇯🇵", rating: 82, form: "W-W-L-D-W" },
  { name: "Morocco", code: "MAR", flag: "🇲🇦", rating: 84, form: "W-D-W-D-W" },
];

export const matches = [
  {
    slug: "united-states-vs-brazil",
    home: teams[0],
    away: teams[1],
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    time: "Jun 18, 2026 · 8:00 PM ET",
    status: "Live",
    score: "1 - 1",
    minute: "62'",
    probabilities: [29, 24, 47],
    expectedScore: "1.4 - 2.1",
    confidence: 84,
    broadcasters: ["FOX", "Telemundo", "Peacock", "Fubo"],
  },
  {
    slug: "france-vs-argentina",
    home: teams[2],
    away: teams[3],
    venue: "SoFi Stadium",
    city: "Los Angeles",
    time: "Jun 21, 2026 · 7:00 PM ET",
    status: "Upcoming",
    score: "0 - 0",
    minute: "Preview",
    probabilities: [36, 27, 37],
    expectedScore: "1.8 - 1.9",
    confidence: 79,
    broadcasters: ["FOX", "Telemundo", "YouTube TV", "DirecTV Stream"],
  },
  {
    slug: "england-vs-mexico",
    home: teams[4],
    away: teams[5],
    venue: "AT&T Stadium",
    city: "Dallas",
    time: "Jun 24, 2026 · 6:00 PM ET",
    status: "Upcoming",
    score: "0 - 0",
    minute: "Preview",
    probabilities: [49, 25, 26],
    expectedScore: "2.0 - 1.2",
    confidence: 76,
    broadcasters: ["FOX", "Telemundo", "Hulu + Live TV", "Sling"],
  },
];

export const articles = [
  {
    slug: "world-cup-2026-ai-power-rankings",
    title: "World Cup 2026 AI Power Rankings: Brazil and France Lead a Brutal Top Tier",
    subtitle: "Our model weighs squad depth, travel distance, venue fit and recent form across every contender.",
    category: "Predictions",
    tags: ["AI model", "rankings", "favorites"],
    author: "Maya Torres",
    date: "May 14, 2026",
    image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=85",
    content:
      "World Cup 2026 will reward depth, rotation and tournament management. Brazil enter the model with the highest attacking ceiling, while France remain the most balanced side across pressure phases. Argentina are still elite in knockout control, England have the cleanest chance creation profile, and Morocco continue to grade above public expectation because of defensive structure and transition speed.",
  },
  {
    slug: "where-to-watch-world-cup-2026-in-usa",
    title: "Where to Watch World Cup 2026 in the USA: Streaming, TV and Spanish-Language Coverage",
    subtitle: "A practical guide for cord-cutters, bilingual viewers and fans traveling across host cities.",
    category: "Watch Guides",
    tags: ["streaming", "FOX", "Telemundo"],
    author: "Evan Brooks",
    date: "May 13, 2026",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1400&q=85",
    content:
      "United States viewers will have multiple routes into every World Cup match, from traditional cable packages to live TV streaming bundles and Spanish-language services. The best option depends on whether you want 4K, DVR, mobile viewing, Spanish commentary or a short-term tournament subscription.",
  },
  {
    slug: "usa-brazil-tactical-preview",
    title: "USA vs Brazil Tactical Preview: Pressing Traps, Wide Rotations and Set Piece Edges",
    subtitle: "The opening 15 minutes could decide whether the match becomes a track meet or a controlled chessboard.",
    category: "Tactics",
    tags: ["USA", "Brazil", "match preview"],
    author: "Leo Martins",
    date: "May 12, 2026",
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1400&q=85",
    content:
      "Brazil's first advantage is their ability to isolate fullbacks. The United States can counter by compressing the ball side and using aggressive third-man outlets after recoveries. Set pieces narrow the gap, especially if the USA can force corners and long throw situations during early pressure windows.",
  },
];

export const standings = [
  { group: "A", team: "United States", pts: 6, gd: 3 },
  { group: "A", team: "Morocco", pts: 4, gd: 1 },
  { group: "A", team: "Japan", pts: 3, gd: 0 },
  { group: "A", team: "Mexico", pts: 1, gd: -4 },
];

export const rankings = [
  { name: "Alex P.", points: 1840, streak: 9 },
  { name: "SofiaDataFC", points: 1788, streak: 6 },
  { name: "BracketKing", points: 1712, streak: 5 },
  { name: "MartaVision", points: 1689, streak: 4 },
];

export const adminNav = [
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "News", icon: Newspaper },
  { label: "SEO", icon: Globe2 },
  { label: "Matches", icon: Trophy },
  { label: "Predictions", icon: Sparkles },
  { label: "Affiliates", icon: BadgeDollarSign },
  { label: "Ads", icon: Radio },
  { label: "Users", icon: Users },
  { label: "Notifications", icon: Bell },
  { label: "Homepage", icon: Shield },
  { label: "Live Ops", icon: Activity },
];
