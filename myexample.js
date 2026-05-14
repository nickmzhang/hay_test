export default {
  async test() {
    // Used by Hayase to check if the extension is working
    return true;
  },

  async single(query, options) {
    // Main search function (single query)
    return [];
  },

  async batch(queries, options) {
    // Optional: batch search support
    return [];
  },

  async movie(query, options) {
    // Optional: movie-specific search (can return same as single for now)
    return [];
  }
};
