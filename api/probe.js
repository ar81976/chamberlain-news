import { isAuthorised, deny } from "./_lib.js";

// GET /api/probe?codes=A,B,C -> what EODHD returns for each code on the live and daily endpoints.
// A maintenance aid for checking ticker codes against the subscription; it never shows the key.

export default async function handler(req, res) {
  if (!isAuthorised(req)) return deny(res);
  const token = (process.env.EODHD_API_TOKEN || "").trim();
  if (!token) return res.status(200).json({ error: "no_key" });
  const codes = String(req.query?.codes || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 12);
  const out = {};
  for (const c of codes) {
    const one = async (url) => {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
        const t = await r.text();
        return { status: r.status, body: t.slice(0, 220).replace(/\s+/g, " ") };
      } catch (e) { return { error: e.name }; }
    };
    out[c] = {
      live: await one(`https://eodhd.com/api/real-time/${encodeURIComponent(c)}?api_token=${encodeURIComponent(token)}&fmt=json`),
      eod: await one(`https://eodhd.com/api/eod/${encodeURIComponent(c)}?from=${new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)}&order=d&api_token=${encodeURIComponent(token)}&fmt=json`),
    };
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(out);
}
