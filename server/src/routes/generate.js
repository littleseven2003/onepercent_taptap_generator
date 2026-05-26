const express = require('express');
const router = express.Router();
const { searchGameInfo } = require('../services/searchService');
const { buildMainPrompt, formatPlayerInfo } = require('../services/promptService');
const { callAI, parseAIResponse, getMockResponse } = require('../services/aiService');
const { checkRateLimit, logGeneration } = require('../services/rateLimiter');

const ACTIVITY_INTRO = '什么是【我的百分之一】见帖子说明：https://www.taptap.cn/moment/371075389700702390';

router.post('/generate', async (req, res, next) => {
  try {
    const { gameName, manualFields } = req.body;

    if (!gameName || !gameName.trim()) {
      return res.status(400).json({ code: 400, message: '游戏名称不能为空' });
    }

    if (gameName.trim().length > 100) {
      return res.status(400).json({ code: 400, message: '游戏名称过长' });
    }

    const rateLimitError = checkRateLimit(req);
    if (rateLimitError) {
      return res.status(429).json(rateLimitError);
    }

    const name = gameName.trim();
    const fields = manualFields || {};

    let searchSummary = '';
    try {
      searchSummary = await searchGameInfo(name);
    } catch (err) {
      console.error('[Search] failed:', err.message);
    }

    let mainText = null;
    let aiFailed = false;
    try {
      mainText = await callAI(buildMainPrompt(name, fields, searchSummary));
    } catch (err) {
      console.error('[AI] call failed:', err.message);
      aiFailed = true;
    }

    if (!mainText) {
      const mock = getMockResponse(name);
      logGeneration(req, name, true);
      return res.json({
        code: 200,
        message: aiFailed ? 'AI 服务暂时不可用，已使用示例内容' : '生成成功（mock 模式）',
        data: {
          ...mock,
          searchSummary: searchSummary || '',
          createdAt: new Date().toISOString(),
        },
      });
    }

    const mainParsed = parseAIResponse(mainText);
    const playerSection = formatPlayerInfo(fields.playerInfo || {});

    const content = ACTIVITY_INTRO + '\n\n' + (mainParsed.content || mainText) + playerSection;

    logGeneration(req, name, true);

    res.json({
      code: 200,
      message: '生成成功',
      data: {
        title: mainParsed.title || `【我的百分之一】+【${name}】`,
        content,
        searchSummary: searchSummary || '',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    try { logGeneration(req, req.body?.gameName || '', false); } catch {}
    next(err);
  }
});

module.exports = router;
