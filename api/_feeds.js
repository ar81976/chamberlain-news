// News feeds shown in Chamberlain News (home edition).
// Each entry: id, source (shown on screen), desk, url, and local: true for Lincolnshire feeds.
// Desks: uk (UK & Lincolnshire), pol (UK Politics), world.
// Add, remove or reorder freely; a feed that fails is skipped and the rest still show.
// Sport is always left out (by the feed's section labels and /sport/ addresses); "skip" leaves out other sections too.

export const FEEDS = [
  // UK & Lincolnshire
  { id: "bbc-uk",          source: "BBC News",          desk: "uk", url: "https://feeds.bbci.co.uk/news/uk/rss.xml" },
  { id: "sky-uk",          source: "Sky News",          desk: "uk", url: "https://feeds.skynews.com/feeds/rss/uk.xml" },
  { id: "bbc-lincs",       source: "BBC Lincolnshire",  desk: "uk", local: true, url: "https://feeds.bbci.co.uk/news/england/lincolnshire/rss.xml" },
  { id: "bbc-humberside",  source: "BBC Humberside",    desk: "uk", local: true, url: "https://feeds.bbci.co.uk/news/england/humberside/rss.xml" },
  { id: "lincs-live",      source: "Lincolnshire Live", desk: "uk", local: true, url: "https://www.lincolnshirelive.co.uk/?service=rss", skip: /^sponsored$/i },
  { id: "grimsby-live",    source: "Grimsby Live",      desk: "uk", local: true, url: "https://www.grimsbytelegraph.co.uk/?service=rss", skip: /^sponsored$/i },

  // UK politics
  { id: "bbc-politics",    source: "BBC Politics",      desk: "pol", url: "https://feeds.bbci.co.uk/news/politics/rss.xml" },
  { id: "sky-politics",    source: "Sky News",          desk: "pol", url: "https://feeds.skynews.com/feeds/rss/politics.xml" },
  { id: "gb-politics",     source: "GB News",           desk: "pol", url: "https://www.gbnews.com/feeds/politics.rss" },

  // World
  { id: "bbc-world",       source: "BBC World",         desk: "world", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { id: "sky-world",       source: "Sky News",          desk: "world", url: "https://feeds.skynews.com/feeds/rss/world.xml" },
  { id: "guardian-world",  source: "Guardian World",    desk: "world", url: "https://www.theguardian.com/world/rss" },

];

export const ITEMS_PER_FEED = 6;
