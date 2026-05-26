const express = require('express');
const router = express.Router();
const { searchGameInfo } = require('../services/searchService');
const { buildPrompt } = require('../services/promptService');
const { callAI, parseAIResponse, getMockResponse } = require('../services/aiService');
const { checkRateLimit, logGeneration } = require('../services/rateLimiter');

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

    const searchSummary = await searchGameInfo(gameName.trim());

    const prompt = buildPrompt(gameName.trim(), manualFields || {}, searchSummary);

    let aiText = await callAI(prompt);
    let usedMock = false;

    if (!aiText) {
      const mock = getMockResponse(gameName.trim());
      logGeneration(req, gameName.trim(), true);
      return res.json({
        code: 200,
        message: '生成成功（mock 模式）',
        data: {
          ...mock,
          searchSummary: searchSummary || '未获取到搜索信息',
          createdAt: new Date().toISOString(),
        },
      });
    }

    const parsed = parseAIResponse(aiText);

    logGeneration(req, gameName.trim(), true);

    res.json({
      code: 200,
      message: '生成成功',
      data: {
        title: parsed.title || `【我的百分之一】+【${gameName.trim()}】`,
        content: parsed.content || aiText,
        searchSummary: searchSummary || '未获取到搜索信息',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    try { logGeneration(req, req.body?.gameName || '', false); } catch {}
    next(err);
  }
});

module.exports = router;
