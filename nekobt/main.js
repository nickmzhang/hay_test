export default class NekoBTSource {
  async search(query) {
    const url = `https://nekobt.com/search/${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // NekoBT usually lists results in a table or list-group
    const rows = doc.querySelectorAll(".list-group-item"); 

    return Array.from(rows).map(row => {
      const titleLink = row.querySelector(".title a");
      const magnet = row.querySelector("a[href^='magnet:']")?.getAttribute("href");
      
      // Metadata (Seeders/Size) are usually in spans or specific classes
      const meta = row.querySelector(".meta")?.textContent || "";
      
      return {
        title: titleLink?.textContent?.trim() || "Unknown",
        magnet: magnet || "",
        seeders: 0, // NekoBT often hides this behind hover/JS
        leechers: 0,
        size: meta.match(/\d+(\.\d+)?\s?(GB|MB)/i)?.[0] || "Unknown"
      };
    }).filter(item => item.magnet); // Only return items with valid magnets
  }
}
