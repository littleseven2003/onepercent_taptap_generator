const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { gameName } = req.body;

    if (!gameName || !gameName.trim()) {
      return res.status(400).json({ code: 400, message: '游戏名称不能为空' });
    }

    // TODO: full generation pipeline
    res.json({
      code: 200,
      message: '生成成功',
      data: {
        title: `【我的百分之一】+【${gameName.trim()}】`,
        content: '（生成内容将在接入 AI 服务后展示）',
        searchSummary: '',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
