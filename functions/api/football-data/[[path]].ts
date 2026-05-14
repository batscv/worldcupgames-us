type PagesContext = {
  request: Request;
  env: {
    FOOTBALL_DATA_API_TOKEN?: string;
  };
  params: {
    path?: string | string[];
  };
};

const API_BASE = "https://api.football-data.org/v4";
const ALLOWED_PREFIXES = [
  "areas",
  "competitions",
  "matches",
  "teams",
  "persons",
];

function getPath(path?: string | string[]) {
  if (!path) {
    return "matches";
  }

  return Array.isArray(path) ? path.join("/") : path;
}

function isAllowedPath(path: string) {
  const [firstSegment] = path.split("/");
  return ALLOWED_PREFIXES.includes(firstSegment);
}

export async function onRequest({ request, env, params }: PagesContext) {
  if (!env.FOOTBALL_DATA_API_TOKEN) {
    return Response.json(
      { error: "Missing FOOTBALL_DATA_API_TOKEN environment variable." },
      { status: 500 },
    );
  }

  const path = getPath(params.path);

  if (!isAllowedPath(path)) {
    return Response.json({ error: "Endpoint is not allowed." }, { status: 403 });
  }

  const sourceUrl = new URL(request.url);
  const upstreamUrl = new URL(`${API_BASE}/${path}`);
  upstreamUrl.search = sourceUrl.search;

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      "X-Auth-Token": env.FOOTBALL_DATA_API_TOKEN,
      "X-Unfold-Goals": sourceUrl.searchParams.get("unfoldGoals") === "true" ? "true" : "false",
    },
  });

  const headers = new Headers(upstreamResponse.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
  headers.delete("set-cookie");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
