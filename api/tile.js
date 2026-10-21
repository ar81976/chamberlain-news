// GET /api/tile?z=6&x=31&y=20 -> a dark map tile for the radar background.
// The map provider refuses TV browsers unless the request looks like it comes from a website, so
// the monitor fetches the tiles itself and passes them on. Cached at the edge for a day.
const HOSTS = ["a", "b", "c", "d"];

export default async function handler(req, res) {
  const z = Number(req.query?.z), x = Number(req.query?.x), y = Number(req.query?.y);
  if (![z, x, y].every(Number.isInteger) || z < 0 || z > 12 || x < 0 || y < 0) return res.status(400).end();
  const s = HOSTS[(x + y) % HOSTS.length];
  const url = `https://${s}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}@2x.png`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Referer": "https://chamberlain-news.vercel.app/",
        "Accept": "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return res.status(502).end();
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", r.headers.get("content-type") || "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("CDN-Cache-Control", "s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).send(buf);
  } catch {
    res.status(502).end();
  }
}
