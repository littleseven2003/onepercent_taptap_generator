const { getDb } = require('../db/sqlite');

const WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 0;
const WINDOW_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 0;
const DAILY_MAX = parseInt(process.env.RATE_LIMIT_DAILY_MAX, 10) || 0;

const LIMIT_ENABLED = WINDOW_MINUTES > 0 || DAILY_MAX > 0;

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
}

function checkRateLimit(req) {
  if (!LIMIT_ENABLED) return null;

  const db = getDb();
  if (!db) return null;

  const ip = getIp(req);
  const now = Date.now();

  if (WINDOW_MINUTES > 0 && WINDOW_MAX > 0) {
    const windowStart = now - WINDOW_MINUTES * 60 * 1000;
    const windowCount = db
      .prepare('SELECT COUNT(*) as cnt FROM generation_logs WHERE ip = ? AND created_at > ?')
      .get(ip, new Date(windowStart).toISOString());

    if (windowCount && windowCount.cnt >= WINDOW_MAX) {
      return { code: 429, message: `生成过于频繁，请${WINDOW_MINUTES}分钟后再试` };
    }
  }

  if (DAILY_MAX > 0) {
    const dayStart = new Date().setHours(0, 0, 0, 0);
    const dailyCount = db
      .prepare('SELECT COUNT(*) as cnt FROM generation_logs WHERE ip = ? AND created_at > ?')
      .get(ip, new Date(dayStart).toISOString());

    if (dailyCount && dailyCount.cnt >= DAILY_MAX) {
      return { code: 429, message: '今日生成次数已达上限，请明天再试' };
    }
  }

  return null;
}

function logGeneration(req, gameName, success) {
  if (!LIMIT_ENABLED) return;

  const db = getDb();
  if (!db) return;

  const ip = getIp(req);
  db.prepare('INSERT INTO generation_logs (ip, user_agent, game_name, success) VALUES (?, ?, ?, ?)').run(
    ip,
    req.headers['user-agent'] || '',
    gameName,
    success ? 1 : 0
  );
}

module.exports = { checkRateLimit, logGeneration, getIp };
