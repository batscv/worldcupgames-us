export type FootballDataTeam = {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
};

export type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number | null;
  stage?: string | null;
  group?: string | null;
  lastUpdated?: string;
  competition?: {
    name?: string;
    code?: string;
    emblem?: string;
  };
  homeTeam?: FootballDataTeam;
  awayTeam?: FootballDataTeam;
  score?: {
    winner?: string | null;
    duration?: string;
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
    halfTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
};

export type FootballDataMatchesResponse = {
  filters?: Record<string, string>;
  resultSet?: {
    count?: number;
    first?: string;
    last?: string;
    played?: number;
  };
  competition?: {
    id?: number;
    name?: string;
    code?: string;
    emblem?: string;
  };
  matches?: FootballDataMatch[];
  error?: string;
  message?: string;
};

export function teamName(team?: FootballDataTeam) {
  return team?.shortName || team?.name || "TBD";
}

export function formatApiDate(utcDate?: string) {
  if (!utcDate) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(utcDate));
}

export function formatApiScore(match: FootballDataMatch) {
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;

  if (home === null || home === undefined || away === null || away === undefined) {
    return "— - —";
  }

  return `${home} - ${away}`;
}

export function readableStage(stage?: string | null) {
  return stage ? stage.replaceAll("_", " ").toLowerCase() : "match";
}

export function readableStatus(status?: string) {
  const map: Record<string, string> = {
    TIMED: "Timed",
    SCHEDULED: "Scheduled",
    LIVE: "Live",
    IN_PLAY: "In play",
    PAUSED: "Half-time",
    FINISHED: "Finished",
    POSTPONED: "Postponed",
    SUSPENDED: "Suspended",
    CANCELED: "Canceled",
  };

  return status ? map[status] || status : "Unknown";
}
