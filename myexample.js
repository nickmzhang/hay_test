function extractTorznabAttr(item, attrName) {
  const attrs = item.getElementsByTagName("torznab:attr");

  for (const attr of attrs) {
    if (attr.getAttribute("name") === attrName) {
      return attr.getAttribute("value");
    }
  }

  return null;
}

async function fetchXML(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();

  return new DOMParser().parseFromString(text, "text/xml");
}

module.exports = {
  id: "nekobt",

  async search(query) {
    const apiKey =
      "YOUR_API_KEY_HERE";

    const url =
      `https://nekobt.to/api/torznab/api?t=search&q=${encodeURIComponent(query)}&apikey=${apiKey}`;

    const xml = await fetchXML(url);

    const items = xml.getElementsByTagName("item");

    const results = [];

    for (const item of items) {
      const title =
        item.getElementsByTagName("title")[0]
          ?.textContent || "Unknown";

      const link =
        item.getElementsByTagName("link")[0]
          ?.textContent || "";

      const size =
        item.getElementsByTagName("size")[0]
          ?.textContent || "0";

      const seeders = Number(
        extractTorznabAttr(item, "seeders") || 0
      );

      const peers = Number(
        extractTorznabAttr(item, "peers") || 0
      );

      results.push({
        title,
        magnet: link,
        link,
        size: Number(size),
        seeders,
        peers,
        source: "nekoBT"
      });
    }

    return results;
  }
};
