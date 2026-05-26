function buildPrompt(gameName, manualFields, searchSummary) {
  const fieldLabels = {
    releasePlatform: '发售平台',
    playTime: '游玩时间',
    targetPlayers: '推荐人群',
    personalStory: '个人故事/推荐理由',
    wishCard: '许愿卡牌',
  };

  const manualParts = [];
  const autoParts = [];

  for (const [key, label] of Object.entries(fieldLabels)) {
    const field = manualFields[key];
    if (field && field.enabled && field.value.trim()) {
      manualParts.push(`${label}：用户明确填写为"${field.value.trim()}"，必须保留这个信息。`);
    } else {
      autoParts.push(`${label}：用户未填写，请根据游戏类型和帖子语境自然生成，不要写得过于具体。`);
    }
  }

  const searchSection = searchSummary
    ? `联网搜索到的游戏信息摘要：\n${searchSummary}`
    : '未搜索到该游戏的详细信息，请根据你对该游戏的了解自然生成。';

  return `你是一个熟悉游戏社区发帖风格的中文写作助手。

现在需要根据 TapTap《我的百分之一》活动要求，帮用户生成一篇游戏推荐帖子。

活动帖子要求：
1. 标题格式为：【我的百分之一】+【游戏名称】
2. 正文需要包含：游戏名称、发售平台、游玩时间、推荐人群、个人故事/推荐理由等内容。
3. 如适合，可自然加入许愿卡牌相关内容。
4. 语气要像真实玩家分享，不要像广告，不要太像 AI 生成。
5. 内容应自然、真诚、有一点个人体验感。
6. 不要编造过于具体且明显不真实的经历。
7. 不要直接复制搜索到的信息，要用自己的话重新表达。
8. 用户手动填写的字段必须优先保留，并自然融入正文。

用户输入：
游戏名称：${gameName}

用户手动填写字段：
${manualParts.join('\n')}

自动生成字段：
${autoParts.join('\n')}

${searchSection}

请生成：
1. 标题
2. 正文

输出格式：
标题：
……

正文：
……`;
}

module.exports = { buildPrompt };
