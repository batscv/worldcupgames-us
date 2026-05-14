import { createClient } from "@supabase/supabase-js";

type TeamPayload = {
  id: number;
  name: string;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
  area?: {
    code?: string | null;
    flag?: string | null;
  };
};

type MatchPayload = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number | null;
  stage?: string | null;
  group?: string | null;
  competition?: {
    code?: string;
  };
  homeTeam?: TeamPayload | null;
  awayTeam?: TeamPayload | null;
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
    };
  };
};

type MatchRow = {
  football_data_id: number;
  slug: string;
  home_team_id: string;
  away_team_id: string;
  kickoff_at: string;
  status: string;
  api_status: string;
  competition_code: string;
  stage: string | null | undefined;
  group_name: string | null | undefined;
  matchday: number | null | undefined;
  home_score: number;
  away_score: number;
  api_payload: MatchPayload;
  last_synced_at: string;
};

type PagesContext = {
  request: Request;
  env: {
    FOOTBALL_DATA_API_TOKEN?: string;
    NEXT_PUBLIC_SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SYNC_SECRET?: string;
  };
};

const API_BASE = "https://api.football-data.org/v4";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapStatus(status: string) {
  if (status === "FINISHED") return "finished";
  if (["LIVE", "IN_PLAY", "PAUSED"].includes(status)) return "live";
  if (["POSTPONED", "SUSPENDED", "CANCELED"].includes(status)) return "postponed";
  return "scheduled";
}

async function fetchFootballData<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`football-data.org ${path} failed with ${response.status}`);
  }

  return response.json();
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (env.SYNC_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.SYNC_SECRET}`) {
      return Response.json({ error: "Unauthorized sync request." }, { status: 401 });
    }
  }

  if (!env.FOOTBALL_DATA_API_TOKEN || !env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json(
      {
        error:
          "Missing FOOTBALL_DATA_API_TOKEN, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY environment variable.",
      },
      { status: 500 },
    );
  }

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const startedAt = new Date().toISOString();

  try {
    const [teamsResponse, matchesResponse] = await Promise.all([
      fetchFootballData<{ teams: TeamPayload[] }>("/competitions/WC/teams", env.FOOTBALL_DATA_API_TOKEN),
      fetchFootballData<{ matches: MatchPayload[] }>("/competitions/WC/matches", env.FOOTBALL_DATA_API_TOKEN),
    ]);

    const teamRows = teamsResponse.teams.map((team) => ({
      football_data_id: team.id,
      name: team.name,
      short_name: team.shortName,
      tla: team.tla,
      country_code: team.area?.code || team.tla || String(team.id),
      crest_url: team.crest || team.area?.flag || null,
      api_payload: team,
      last_synced_at: new Date().toISOString(),
    }));

    const { error: teamsError } = await supabase.from("teams").upsert(teamRows, {
      onConflict: "football_data_id",
    });

    if (teamsError) throw teamsError;

    const { data: storedTeams, error: storedTeamsError } = await supabase
      .from("teams")
      .select("id, football_data_id");

    if (storedTeamsError) throw storedTeamsError;

    const teamIdByFootballDataId = new Map(
      (storedTeams || []).map((team) => [team.football_data_id as number, team.id as string]),
    );

    const matchRows = matchesResponse.matches
      .filter((match) => match.homeTeam?.id && match.awayTeam?.id)
      .map((match) => {
        const homeTeamId = teamIdByFootballDataId.get(match.homeTeam?.id as number);
        const awayTeamId = teamIdByFootballDataId.get(match.awayTeam?.id as number);

        if (!homeTeamId || !awayTeamId) {
          return null;
        }

        const slug = `${slugify(match.homeTeam?.shortName || match.homeTeam?.name || "home")}-vs-${slugify(
          match.awayTeam?.shortName || match.awayTeam?.name || "away",
        )}-${match.id}`;

        return {
          football_data_id: match.id,
          slug,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          kickoff_at: match.utcDate,
          status: mapStatus(match.status),
          api_status: match.status,
          competition_code: match.competition?.code || "WC",
          stage: match.stage,
          group_name: match.group,
          matchday: match.matchday,
          home_score: match.score?.fullTime?.home ?? 0,
          away_score: match.score?.fullTime?.away ?? 0,
          api_payload: match,
          last_synced_at: new Date().toISOString(),
        };
      })
      .filter((row): row is MatchRow => row !== null);

    const { error: matchesError } = await supabase.from("matches").upsert(matchRows, {
      onConflict: "football_data_id",
    });

    if (matchesError) throw matchesError;

    await supabase.from("api_sync_runs").insert({
      resource: "football-data:wc",
      status: "success",
      records_processed: teamRows.length + matchRows.length,
      message: `Synced ${teamRows.length} teams and ${matchRows.length} matches.`,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
    });

    return Response.json({
      ok: true,
      teams: teamRows.length,
      matches: matchRows.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";

    await supabase.from("api_sync_runs").insert({
      resource: "football-data:wc",
      status: "failed",
      records_processed: 0,
      message,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
    });

    return Response.json({ error: message }, { status: 500 });
  }
}
