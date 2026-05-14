export default class NyaaSource {
  async search(query) {
    try {
      const url = `https://nyaa.si/?page=rss&q=${encodeURIComponent(query)}&c=1_2&f=0`;
      const response = await fetch(url);
      if (!response.ok) return [];

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const items = xml.querySelectorAll("item") || [];

      return Array.from(items).map(item => {
        const getNsTag = (name) => item.getElementsByTagName(`nyaa:${name}`)[0]?.textContent;
        return {
          title: item.querySelector("title")?.textContent || "Unknown",
          magnet: item.querySelector("link")?.textContent || "",
          seeders: parseInt(getNsTag("seeders") || "0"),
          leechers: parseInt(getNsTag("leechers") || "0"),
          size: getNsTag("size") || "Unknown",
        };
      });
    } catch (e) {
      console.error("Nyaa Error:", e);
      return []; // Returns empty array instead of crashing
    }
  }
}export default class NyaaSource {
  async search(query) {
    // We use the RSS feed because it's easier to parse than raw HTML
    const url = `https://nyaa.si/?page=rss&q=${encodeURIComponent(query)}&c=1_2&f=0`;
    const response = await fetch(url);
    const xmlText = await response.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = xml.querySelectorAll("item");

    return Array.from(items).map(item => {
      // Nyaa uses custom namespaces for seeders and size
      const getNsTag = (name) => item.getElementsByTagName(`nyaa:${name}`)[0]?.textContent;

      return {
        title: item.querySelector("title")?.textContent || "Unknown Title",
        magnet: item.querySelector("link")?.textContent || "",
        seeders: parseInt(getNsTag("seeders") || "0"),
        leechers: parseInt(getNsTag("leechers") || "0"),
        size: getNsTag("size") || "Unknown Size",
        date: item.querySelector("pubDate")?.textContent
      };
    });
  }
}
