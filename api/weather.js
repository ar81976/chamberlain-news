import { isAuthorised, deny } from "./_lib.js";

// GET /api/weather -> today's weather for Springfield, Healing, from Open-Meteo (free, no key).
// Cached at the edge for 15 minutes. Change the place with WEATHER_LAT / WEATHER_LON / WEATHER_PLACE.

const LAT = process.env.WEATHER_LAT || "53.580";
const LON = process.env.WEATHER_LON || "-0.153";
const PLACE = process.env.WEATHER_PLACE || "Healing";

const CODES = {
  0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Fog", 48: "Freezing Fog",
  51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle", 56: "Freezing Drizzle", 57: "Freezing Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain", 66: "Freezing Rain", 67: "Freezing Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 77: "Snow Grains",
  80: "Light Showers", 81: "Showers", 82: "Heavy Showers", 85: "Snow Showers", 86: "Heavy Snow Showers",
  95: "Thunderstorms", 96: "Thunderstorms With Hail", 99: "Thunderstorms With Hail",
};
const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export default async function handler(req, res) {
  if (!isAuthorised(req)) return deny(res);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}`
    + "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day"
    + "&hourly=temperature_2m,precipitation_probability"
    + "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max"
    + "&timezone=Europe%2FLondon&wind_speed_unit=mph&forecast_days=2";
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    const c = d.current;
    const nowIdx = Math.max(0, d.hourly.time.findIndex(t => t >= c.time.slice(0, 13) + ":00"));
    const hours = d.hourly.time.slice(nowIdx + 1, nowIdx + 6).map((t, i) => ({
      t: t.slice(11, 16), temp: Math.round(d.hourly.temperature_2m[nowIdx + 1 + i]),
      rain: d.hourly.precipitation_probability?.[nowIdx + 1 + i] ?? null,
    }));
    res.setHeader("Cache-Control", "private, max-age=300");
    res.setHeader("CDN-Cache-Control", "s-maxage=900, stale-while-revalidate=1800");
    res.status(200).json({
      ok: true, place: PLACE,
      temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature),
      sky: CODES[c.weather_code] || "—", code: c.weather_code, day: !!c.is_day,
      wind: Math.round(c.wind_speed_10m), windDir: DIRS[Math.round(c.wind_direction_10m / 45) % 8],
      high: Math.round(d.daily.temperature_2m_max[0]), low: Math.round(d.daily.temperature_2m_min[0]),
      rainChance: d.daily.precipitation_probability_max?.[0] ?? null,
      sunrise: d.daily.sunrise[0]?.slice(11, 16), sunset: d.daily.sunset[0]?.slice(11, 16),
      hours,
    });
  } catch {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: false });
  }
}
