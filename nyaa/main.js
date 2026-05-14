export default class NyaaExtension {
  async search(query) {
    const url = `https://nyaa.si/?page=rss&q=${encodeURIComponent(query)}&c=1_2&f=0`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Hayase provides a built-in XML parser in the extension environment
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");

    return Array.from(items).map(item => ({
      title: item.querySelector("title").textContent,
      magnet: item.querySelector("link").textContent,
      seeders: parseInt(item.getElementsByTagName("nyaa:seeders")[0]?.textContent || 0),
      leechers: parseInt(item.getElementsByTagName("nyaa:leechers")[0]?.textContent || 0),
      size: item.getElementsByTagName("nyaa:size")[0]?.textContent || "Unknown"
    }));
  }
}
