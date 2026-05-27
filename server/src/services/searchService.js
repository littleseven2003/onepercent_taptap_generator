const axios = require('axios');

const SEARCH_TIMEOUT = 5000;

function createSearchStatus(status, message, results = []) {
  const snippets = results
    .filter((item) => item.status === 'success' && item.content)
    .map((item) => item.content);

  return {
    status,
    message,
    results,
    summary: snippets.join('；'),
  };
}

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

    const searchResults = [];
    for (const [index, result] of results.entries()) {
      const query = queries[index];
      if (result.status === 'fulfilled') {
        const body = result.value.data;
        const matches = body.match(/<span[^>]*>(.*?)<\/span>/gi) || [];
        const snippets = [
          ...new Set(
            matches
              .map((m) => m.replace(/<[^>]+>/g, '').trim())
              .filter((t) => t.length > 10 && t.length < 300)
          ),
        ].slice(0, 2);

        if (snippets.length > 0) {
          searchResults.push({
            query,
            status: 'success',
            title: query,
            content: snippets.join('；'),
          });
        } else {
          searchResults.push({
            query,
            status: 'empty',
            title: query,
            content: '没有提取到可用摘要',
          });
        }
      } else {
        const isTimeout = result.reason?.code === 'ECONNABORTED';
        searchResults.push({
          query,
          status: isTimeout ? 'timeout' : 'failed',
          title: query,
          content: isTimeout ? '搜索请求超时' : '搜索请求失败',
        });
      }
    }

    const successful = searchResults.filter((item) => item.status === 'success');
    if (successful.length > 0) {
      const hasIssue = searchResults.some((item) => item.status !== 'success');
      return createSearchStatus(
        hasIssue ? 'partial' : 'success',
        hasIssue ? `搜索完成，找到 ${successful.length} 条可用结果，部分关键词未取到结果` : `搜索完成，找到 ${successful.length} 条可用结果`,
        searchResults
      );
    }

    const hasTimeout = searchResults.some((item) => item.status === 'timeout');
    const hasFailed = searchResults.some((item) => item.status === 'failed');
    if (hasTimeout) {
      return createSearchStatus('timeout', '搜索超时，已改用通用生成方式', searchResults);
    }
    if (hasFailed) {
      return createSearchStatus('failed', '搜索失败，已改用通用生成方式', searchResults);
    }

    return createSearchStatus('empty', '没有搜索到可用摘要，已改用通用生成方式', searchResults);
  } catch {
    return createSearchStatus('failed', '搜索服务异常，已改用通用生成方式');
  }
}

module.exports = { searchGameInfo };
