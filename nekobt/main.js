export default class NekoBTSource {
  async search(query) {
    try {
      const url = `https://nekobt.com/search/${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) return [];

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      // Target the table rows in the results table
      const rows = doc.querySelectorAll("table.table tbody tr") || []; 

      return Array.from(rows).map(row => {
        const titleAnchor = row.querySelector("a[href^='/show/']");
        const magnetAnchor = row.querySelector("a[href^='magnet:']");
        
        // NekoBT usually has columns: Type, Title, Size, Date, Seeds, Leeches
        const cells = row.querySelectorAll("td");

        return {
          title: titleAnchor?.textContent?.trim() || "Unknown",
          magnet: magnetAnchor?.getAttribute("href") || "",
          seeders: parseInt(cells[4]?.textContent) || 0,
          leechers: parseInt(cells[5]?.textContent) || 0,
          size: cells[2]?.textContent?.trim() || "Unknown"
        };
      }).filter(item => item.magnet !== "");
    } catch (e) {
      console.error("NekoBT Error:", e);
      return []; 
    }
  }
}
