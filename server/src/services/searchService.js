const axios = require('axios');

const DEFAULT_TIMEOUT = 8000;
const SEARCH_TIMEOUT = parseInt(process.env.SEARCH_TIMEOUT_MS, 10) || DEFAULT_TIMEOUT;
const SEARCH_ENABLED = process.env.SEARCH_ENABLED !== 'false';
const SEARCH_PROVIDER = (process.env.SEARCH_PROVIDER || 'auto').toLowerCase();
const SEARCH_USE_PROXY = process.env.SEARCH_USE_PROXY === 'true';

const PROVIDERS = {
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search',
    params: (query) => ({ q: query, setlang: 'zh-CN', mkt: 'zh-CN' }),
    extract: extractBingSnippets,
  },
  baidu: {
    name: '百度',
    url: 'https://www.baidu.com/s',
    params: (query) => ({ wd: query }),
    extract: extractGenericSnippets,
  },
  sm: {
    name: '神马',
    url: 'https://yz.m.sm.cn/s',
    params: (query) => ({ q: query }),
    extract: extractGenericSnippets,
  },
  google: {
    name: 'Google',
    url: 'https://www.google.com/search',
    params: (query) => ({ q: query, hl: 'zh-CN' }),
    extract: extractGenericSnippets,
  },
};

const PROVIDER_ORDER = {
  auto: ['bing', 'sm', 'baidu'],
  basic: ['bing', 'sm', 'baidu'],
  bing: ['bing'],
  sm: ['sm'],
  baidu: ['baidu'],
  google: ['google'],
  none: [],
};

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

function getProviderOrder() {
  return PROVIDER_ORDER[SEARCH_PROVIDER] || PROVIDER_ORDER.auto;
}

function stripHtml(text) {
  return decodeHtmlEntities(
    String(text || '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, ' ');
}

function getQueryTarget(query) {
  return String(query || '').split(/\s+/)[0].trim();
}

function isUsefulSnippet(text, query) {
  const target = getQueryTarget(query);
  if (!text || text.length <= 10 || text.length >= 300) return false;
  if (/url=|query:|pro_type|http:\/\/www\.baidu\.com|百度一下|必应|登录|验证码|cookie|内容错误|内容过时|内容低质|内容无关/i.test(text)) return false;
  if (/^(网页|图片|视频|新闻|地图|知道|贴吧)$/.test(text)) return false;
  return !target || target.length < 2 || text.includes(target);
}

function normalizeSnippets(snippets, query) {
  return [...new Set(snippets.map(stripHtml))]
    .filter((text) => isUsefulSnippet(text, query))
    .slice(0, 2);
}

function extractBingSnippets(html, query) {
  const snippets = [];
  const resultBlocks = html.match(/<li[^>]+class=["'][^"']*b_algo[^"']*["'][^>]*>.*?<\/li>/gis) || [];

  for (const block of resultBlocks) {
    const title = stripHtml((block.match(/<h2[^>]*>(.*?)<\/h2>/is) || [])[1] || '');
    const caption = stripHtml((block.match(/<p[^>]*>(.*?)<\/p>/is) || [])[1] || '');
    snippets.push(`${title} ${caption}`.trim());
  }

  if (snippets.length === 0) {
    const captionMatches = html.match(/<p[^>]*>(.*?)<\/p>/gis) || [];
    snippets.push(...captionMatches.map(stripHtml));
  }

  return normalizeSnippets(snippets, query);
}

function extractGenericSnippets(html, query) {
  const snippets = [];
  const metaMatches = [...html.matchAll(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["'][^>]*>/gi)];
  snippets.push(...metaMatches.map((match) => match[1]));

  const contentMatches = [...html.matchAll(/content=["']([^"']{20,300})["']/gi)];
  snippets.push(...contentMatches.map((match) => match[1]));

  const paragraphMatches = html.match(/<(?:span|p|div)[^>]*>(.*?)<\/(?:span|p|div)>/gis) || [];
  snippets.push(...paragraphMatches.map(stripHtml));

  return normalizeSnippets(snippets, query);
}

async function fetchProviderSearch(providerKey, query) {
  const provider = PROVIDERS[providerKey];
  const response = await axios.get(provider.url, {
    params: provider.params(query),
    proxy: SEARCH_USE_PROXY ? undefined : false,
    headers: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
      'User-Agent': 'Mozilla/5.0 (compatible; OnePercentBot/1.0)',
    },
    timeout: SEARCH_TIMEOUT,
  });

  return provider.extract(response.data, query);
}

async function searchOneQuery(query, providerOrder) {
  const attempts = [];

  for (const providerKey of providerOrder) {
    const provider = PROVIDERS[providerKey];
    if (!provider) continue;

    try {
      const snippets = await fetchProviderSearch(providerKey, query);
      if (snippets.length > 0) {
        return {
          query,
          provider: provider.name,
          status: 'success',
          title: query,
          content: snippets.join('；'),
          attempts: [...attempts, { provider: provider.name, status: 'success' }],
        };
      }

      attempts.push({ provider: provider.name, status: 'empty' });
    } catch (err) {
      attempts.push({
        provider: provider.name,
        status: err.code === 'ECONNABORTED' ? 'timeout' : 'failed',
      });
    }
  }

  const hasTimeout = attempts.some((item) => item.status === 'timeout');
  const hasFailed = attempts.some((item) => item.status === 'failed');
  const providerNames = attempts.map((item) => `${item.provider}${item.status === 'timeout' ? '超时' : item.status === 'failed' ? '失败' : '无摘要'}`).join('、');

  return {
    query,
    provider: attempts.map((item) => item.provider).join(' / '),
    status: hasTimeout ? 'timeout' : hasFailed ? 'failed' : 'empty',
    title: query,
    content: providerNames || '没有可用搜索源',
    attempts,
  };
}

async function searchGameInfo(gameName) {
  if (!SEARCH_ENABLED || SEARCH_PROVIDER === 'none') {
    return createSearchStatus('disabled', '搜索已关闭，已直接使用 AI 生成', []);
  }

  const providerOrder = getProviderOrder();
  if (providerOrder.length === 0) {
    return createSearchStatus('disabled', '搜索源未启用，已直接使用 AI 生成', []);
  }

  try {
    const queries = [
      `${gameName} 游戏 简介 玩法`,
      `${gameName} 发售平台`,
      `${gameName} 评测 评价`,
    ];

    const searchResults = await Promise.all(queries.map((query) => searchOneQuery(query, providerOrder)));
    const successful = searchResults.filter((item) => item.status === 'success');
    const providerLabel = providerOrder.map((key) => PROVIDERS[key]?.name).filter(Boolean).join(' / ');

    if (successful.length > 0) {
      const hasIssue = searchResults.some((item) => item.status !== 'success');
      return createSearchStatus(
        hasIssue ? 'partial' : 'success',
        hasIssue ? `搜索完成，找到 ${successful.length} 条可用结果，部分关键词未取到结果（${providerLabel}）` : `搜索完成，找到 ${successful.length} 条可用结果（${providerLabel}）`,
        searchResults
      );
    }

    const hasTimeout = searchResults.some((item) => item.status === 'timeout');
    const hasFailed = searchResults.some((item) => item.status === 'failed');
    if (hasTimeout) {
      return createSearchStatus('timeout', `搜索超时，已改用通用生成方式（${providerLabel}）`, searchResults);
    }
    if (hasFailed) {
      return createSearchStatus('failed', `搜索失败，已改用通用生成方式（${providerLabel}）`, searchResults);
    }

    return createSearchStatus('empty', `没有搜索到可用摘要，已改用通用生成方式（${providerLabel}）`, searchResults);
  } catch {
    return createSearchStatus('failed', '搜索服务异常，已改用通用生成方式');
  }
}

module.exports = { searchGameInfo };
