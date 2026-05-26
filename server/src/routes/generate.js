const express = require('express');
const router = express.Router();
const { searchGameInfo } = require('../services/searchService');
const { buildMainPrompt, buildPlayerInfoPrompt, formatPlayerInfo } = require('../services/promptService');
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

    const name = gameName.trim();
    const fields = manualFields || {};

    const searchSummary = await searchGameInfo(name);

    // Chunk 1: main post body
    const mainPrompt = buildMainPrompt(name, fields, searchSummary);
    let mainText = await callAI(mainPrompt);
    let usedMock = false;

    if (!mainText) {
      // Mock mode
      const mock = getMockResponse(name);
      logGeneration(req, name, true);
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

    const mainParsed = parseAIResponse(mainText);

    // Chunk 2: player info section
    const playerInfo = fields.playerInfo || {};
    let playerSection = '';

    if (playerInfo.enabled) {
      playerSection = formatPlayerInfo(playerInfo);
    } else {
      const playerPrompt = buildPlayerInfoPrompt(name, null);
      const playerText = await callAI(playerPrompt);
      if (playerText) {
        playerSection = '\n\n' + playerText.trim();
      }
    }

    const content = (mainParsed.content || mainText) + playerSection;

    logGeneration(req, name, true);

    res.json({
      code: 200,
      message: '生成成功',
      data: {
        title: mainParsed.title || `【我的百分之一】+【${name}】`,
        content,
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
