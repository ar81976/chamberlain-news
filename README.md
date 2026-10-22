# Chamberlain News (Springfield)

The home edition of the Redfern Cavendish Monitor: the same news, live TV and market feeds, in the
Chamberlain style (bronze on black). It is a separate copy with its own address, PIN and settings,
so the office monitor is unaffected.
One app, three layouts: desktop, phone and the office Fire TV stick. It installs with its own crest
icon on iPhone, iPad, Android, Windows and Mac, and opens full screen like any other app.

---

## Publishing

Every push to the `main` branch on GitHub publishes the monitor: Vercel builds it, stamps a fresh
version number (`node stamp.cjs`) and puts it live, and the screens pick it up within a minute. The
old way, double-clicking `publish.cmd` on the office PC, still works as a fallback. Every publish is
listed under Deployments in the Vercel dashboard, and any earlier one can be put back from there.

## 1. Put it online at news.redcav.com

The monitor runs on **Vercel**. It can sit on the same Pro account as the office monitor, as a
second project.

1. Sign in to the Vercel account at vercel.com.
2. On a computer with Node.js installed (nodejs.org, the "LTS" version), open a terminal in this folder and run:
   ```
   npx vercel
   ```
   Sign in when asked and accept the suggested answers. This creates the project and a preview address.
3. In the Vercel dashboard, open the project, then **Settings → Environment Variables**, and add:

   | Name | Value |
   |---|---|
   | `APP_PIN` | The PIN for opening the monitor, e.g. 6 digits. Leave out to have no PIN. |
   | `SESSION_SECRET` | Any long random phrase (keeps sign-ins secure). |
   | `EODHD_API_TOKEN` | Your market-data key (see section 2). Leave out until you have one. |

4. Publish the live version:
   ```
   npx vercel --prod
   ```
5. **Settings → Domains → Add** `news.redcav.com`. Vercel shows one DNS record to add, a **CNAME**
   pointing `news` to Vercel. Add that record wherever redcav.com is registered. The padlock
   (https) is set up automatically, usually within minutes.

Each device signs in with the PIN once and stays signed in for a year.

## 2. Market prices (ticker)

Prices come from **EODHD** (eodhd.com), delayed by about 15 minutes. Until a key is added, the
ticker says prices are not connected; it never shows invented numbers.

- This uses the same EODHD key as the Redfern Cavendish Monitor: the **EOD Historical Data: All
  World** plan ($19.99 a month or $199 a year, October 2026). Put the same key in `EODHD_API_TOKEN`
  in both Vercel projects. Together the two use roughly 25,000 of the plan's 100,000 daily calls.
- Gilt yields (bonds) may need the All-in-One plan ($99.99 a month), so test them first. If they
  don't show, they drop off the ticker on their own.
- Add the key as `EODHD_API_TOKEN` (section 1, step 3) and publish again (`npx vercel --prod`).
- Prices refresh every 5 minutes. London shares show in pence, as on the LSE.
- The indices, currencies, gold, Brent crude and the 2-, 10- and 30-year gilt yields appear on every loop of the ticker (gilts show the yield and its move in percentage points). The shares are in three groups
  (UK Shares, US Tech & AI, Luxury) which take turns, one group per loop, each introduced by a
  bronze group marker.
- To change which shares appear, or their groups, edit `api/_markets.js`.

## 3. Install it as an app

**iPhone / iPad:** open `https://news.redcav.com` in **Safari** → tap **Share** → **Add to Home Screen** → **Add**.
The crest icon appears on the home screen as "RC Monitor".

**Android:** open the address in **Chrome** → menu (⋮) → **Install app**.

**Windows / Mac:** open the address in **Chrome** or **Edge** → click the install icon at the right of
the address bar (a screen with a down arrow) → **Install**. It then appears in the Start menu or Dock.

Once installed it opens in its own window with no browser bars, and updates itself whenever the
monitor is changed. There is nothing to reinstall.

## 4. The Fire TV sticks

**Quick way:** open the **Silk** browser on the stick and go to `news.redcav.com`.

**Best way (recommended): Fully Kiosk Browser.** It starts the monitor full screen when the stick
turns on and stops the screen going to sleep.

1. On the stick: **Settings → My Fire TV → Developer Options**, turn on installing apps from the
   **Downloader** app (install "Downloader" from the Amazon Appstore first). If Developer Options is
   hidden, go to **Settings → My Fire TV → About** and press the centre button on the device name 7 times.
2. In Downloader, enter the address of the Fully Kiosk Browser download from fully-kiosk.com and install it.
3. In Fully Kiosk's settings:
   - **Start URL:** `https://news.redcav.com`
   - **Web Content Settings:** turn on the option that lets videos play automatically (named along the
     lines of "Autoplay Videos"), so sound can come back on by itself after a restart.
   - **Device Management:** keep the screen on; start on boot.
   - **Web Browsing / Toolbars:** leave the address bar, status bar and navigation bar off (the
     default), so the monitor fills the whole screen with nothing from the browser showing.
4. Enter the PIN once on screen.

**Sound:** browsers start live video silently. Press the **centre button** (or ▶❚❚) once and the
sound comes on through the TV. The monitor remembers this, so it stays on when you change channel and
after a restart (with the autoplay option above).

### News panels on the TV

On the TV's overview, each news panel shows a page of headlines that fits, then fades to its next
page every 20 seconds (a small "1/3" beside the panel title shows which page). The panels are
staggered so they never all change at once, and a panel never turns while the remote's highlight
is on one of its headlines. Computers, iPads and phones don't page; you scroll those yourself.

### Remote control

The Fire TV opens on the same overview as the iPad, fitted to the TV screen. A bronze highlight
shows where you are.

| Button | On the overview | In TV Mode |
|---|---|---|
| ◀ ▶ ▲ ▼ | Move the highlight (tabs, channel tiles, buttons, headlines) | ◀ ▶ change channel; ▲ ▼ return to the overview |
| Centre button | Select: a channel tile goes on the main screen; TV Mode goes full screen | Sound on / off |
| ▶❚❚ | Sound on / off | Sound on / off |
| ⏪ ⏩ | | Previous / next channel |
| Home | Fire TV home screen, for Prime Video, BBC iPlayer and other apps | |

### Prime Video and BBC iPlayer

These play in their own Fire TV apps, with sound through the TV as normal. Press **Home**, open Prime
Video or iPlayer, and when finished open Fully Kiosk (or Silk) again to return to the monitor. BBC News
plays inside the monitor from its YouTube stream; BBC Parliament is iPlayer-only, so its button on the
TV tab opens iPlayer instead.

## 5. Weather

The Weather panel and the temperature beside the clock show the forecast for Healing from
Open-Meteo (free, no account or key). It refreshes every 15 minutes. To show somewhere else, set
`WEATHER_LAT`, `WEATHER_LON` and `WEATHER_PLACE` in Vercel.


**Rain radar:** the bottom-right panel loops the last two hours of rain over Lincolnshire, from
RainViewer's free radar service on a dark map (CARTO / OpenStreetMap), with Springfield marked. It
refreshes every 10 minutes. Beneath it are any current Met Office weather warnings for the Yorkshire &
Humber region, which covers Healing (change with `WARNINGS_REGION`). Both are free and need no key;
if either provider changes its service, the panel says it is unavailable and the rest carries on.

This home edition does not include Petition Watch or Case Monitor; those stay on the office monitor.

## 6. Changing what it shows

| To change | Edit |
|---|---|
| News feeds | `api/_feeds.js` (each feed: source name, section, address; `local: true` marks Lincolnshire feeds, which always get a share of the UK & Lincolnshire panel) |
| TV channels | `public/channels.js` (YouTube channel ID for channels that play inside the monitor) |
| Ticker shares | `api/_markets.js` |

Then publish again with `npx vercel --prod`.

**About the TV channels:** GB News (the main screen), BBC News, Sky News, LBC, Bloomberg, Euronews,
Al Jazeera English, France 24, DW News, CNA and TRT World play from their official free YouTube live
streams, British channels first. A channel that isn't streaming, or doesn't allow its stream to play
inside other sites, is skipped automatically: the main screen moves to the next channel, the tiles
fill from further down the list, and the channel is tried again every 30 minutes. If a broadcaster
changes its YouTube channel, update its ID in `public/channels.js`.

**About the news:** the monitor shows headlines with a link to the publisher's own page, never the
article text. Sport is left out of every feed (Grimsby Town, Scunthorpe United and the rest), by the
feed's own section labels and by the article's address (`/sport/`), and so are the local papers'
sponsored features; a feed can name other sections to leave out with `skip` in `api/_feeds.js`.

## 7. Trying it on a computer first

```
npm run dev
```
then open http://localhost:3000 (add `?tv` for the Fire TV layout). Set `APP_PIN` and
`EODHD_API_TOKEN` in the terminal first to try the PIN screen and prices.
