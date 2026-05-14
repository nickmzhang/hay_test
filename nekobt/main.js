export default class NekoBTExtension {
  async search(query) {
    // Note: NekoBT may require a specific endpoint or API key depending on their current API status
    const url = `https://nekobt.com/api/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.results.map(item => ({
      title: item.title,
      magnet: item.magnet,
      seeders: item.seeders,
      leechers: item.leechers,
      size: item.size
    }));
  }
}
