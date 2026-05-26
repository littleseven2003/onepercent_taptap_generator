const axios = require('axios');

const SEARCH_TIMEOUT = 15000;

async function searchGameInfo(gameName) {
  try {
    const queries = [
      `${gameName} 游戏 简介 玩法`,
      `${gameName} 发售平台`,
      `${gameName} 评测 评价`,
    ];

    const results = await Promise.allSettled(
      queries.map((q) =>
        axios.get('https://www.google.com/search', {
          params: { q },
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; OnePercentBot/1.0)',
          },
          timeout: SEARCH_TIMEOUT,
        })
      )
    );

    const snippets = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const body = result.value.data;
        const matches = body.match(/<span[^>]*>(.*?)<\/span>/gi) || [];
        snippets.push(
          ...matches
            .map((m) => m.replace(/<[^>]+>/g, '').trim())
            .filter((t) => t.length > 10 && t.length < 300)
            .slice(0, 3)
        );
      }
    }

    if (snippets.length === 0) {
      return '';
    }

    const unique = [...new Set(snippets)].slice(0, 8);
    return unique.join('；');
  } catch {
    return '';
  }
}

module.exports = { searchGameInfo };
