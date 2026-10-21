import { isAuthorised, deny, parseFeed } from "./_lib.js";

// GET /api/warnings -> current Met Office weather warnings for the region (RSS, free, no key).
// Healing (North East Lincolnshire) sits in the Met Office's Yorkshire & Humber warning region, "yh".
// Use WARNINGS_REGION to change it (e.g. "em" for East Midlands, which covers the rest of Lincolnshire).

const REGION = process.env.WARNINGS_REGION || "yh";

export default async function handler(req, res) {
  if (!isAuthorised(req)) return deny(res);
  const url = `https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/${encodeURIComponent(REGION)}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { Accept: "application/rss+xml, application/xml" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const items = parseFeed(await r.text()).slice(0, 4).map(i => ({ title: i.title, link: i.link }));
    res.setHeader("Cache-Control", "private, max-age=300");
    res.setHeader("CDN-Cache-Control", "s-maxage=600");
    res.status(200).json({ ok: true, items });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: false, items: [] });
  }
}
