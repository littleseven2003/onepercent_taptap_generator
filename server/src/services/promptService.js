function buildMainPrompt(gameName, manualFields, searchSummary) {
  const searchSection = searchSummary
    ? `联网搜索到的游戏信息摘要：\n${searchSummary}`
    : '未搜索到该游戏的详细信息，请根据你对该游戏的了解自然生成。';

  const manualLines = [];
  const autoLines = [];

  const fields = [
    { key: 'releasePlatform', label: '发售平台' },
    { key: 'playTime', label: '游玩时间' },
    { key: 'targetPlayers', label: '推荐人群' },
    { key: 'personalStory', label: '个人故事/推荐理由' },
  ];

  for (const { key, label } of fields) {
    const f = manualFields[key];
    if (f && f.enabled && f.value.trim()) {
      manualLines.push(`${label}：用户明确填写为"${f.value.trim()}"，必须原样保留并融入正文。`);
    } else {
      autoLines.push(`${label}：用户未填写，请根据游戏类型和帖子语境自然生成，不要过于具体。`);
    }
  }

  return `你是一个熟悉游戏社区发帖风格的中文写作助手。请为 TapTap《我的百分之一》活动生成一篇游戏推荐帖子的主体部分。

【帖子内容结构】（按顺序写，但不要输出"第一段""第二段"等标签，直接写内容）：

1. 第一段：一句话说明这是参与活动，并附上活动链接：https://www.taptap.cn/moment/371075389700702390
2. 第二段：列出游戏名称（${gameName}）、发售平台、游玩时间、推荐人群
3. 第三段及以后：用自然真诚的语气介绍游戏内容，并分享一段个人体验或故事。这是最重要的部分，缺少个人故事审核不会通过，请务必写一段有真实感的个人经历。

【写作要求】
- 语气像真实玩家在论坛发帖分享，不要像广告或 AI 生成
- 个人故事要有一点细节感，但不能编造过于夸张的经历
- 不直接复制搜索信息，用自己的话表达
- 不要在文中出现"第一段""第二段""活动说明""基本信息"等段落标签
- 不要输出"标题："和"正文："这类标记，直接输出帖子内容即可

${searchSection}

用户手动填写的字段（必须原样保留）：
${manualLines.length > 0 ? manualLines.join('\n') : '（无）'}

需要自动生成的字段：
${autoLines.join('\n')}

请直接输出帖子标题和正文（不要包含玩家信息/许愿部分，后面会单独处理）：

【我的百分之一】+【${gameName}】

正文：
……`;
}

function buildPlayerInfoPrompt(gameName, playerInfo) {
  if (playerInfo && playerInfo.enabled) {
    const parts = [];
    if (playerInfo.wishCard.trim()) parts.push(`许愿卡牌：${playerInfo.wishCard.trim()}`);
    if (playerInfo.gameId.trim()) parts.push(`游戏ID：${playerInfo.gameId.trim()}`);
    if (playerInfo.accountId.trim()) parts.push(`账号ID：${playerInfo.accountId.trim()}`);
    if (playerInfo.server.trim()) parts.push(`区服：${playerInfo.server.trim()}`);
    return parts.length > 0 ? parts.join('\n') : null;
  }

  return `你是一个熟悉游戏社区发帖风格的中文写作助手。

请为以下游戏推荐帖子补充"玩家信息/许愿"部分。这是帖子末尾的收尾段落。

游戏名称：${gameName}

【要求】
1. 自然过渡到许愿卡牌，用1-2句话
2. 许愿一张六星卡牌（卡牌名合理即可）
3. 附上占位的游戏ID、账号ID、区服信息
4. 语气轻松自然，像玩家随口一提

请输出（直接输出段落，不要标记"玩家信息"等标题）：
……`;
}

function formatPlayerInfo(playerInfo) {
  const parts = [];
  if (playerInfo.wishCard.trim()) parts.push(`许愿卡牌：${playerInfo.wishCard.trim()}`);
  if (playerInfo.gameId.trim()) parts.push(`游戏ID：${playerInfo.gameId.trim()}`);
  if (playerInfo.accountId.trim()) parts.push(`账号ID：${playerInfo.accountId.trim()}`);
  if (playerInfo.server.trim()) parts.push(`区服：${playerInfo.server.trim()}`);
  return parts.length > 0 ? `\n\n${parts.join('\n')}` : '';
}

module.exports = { buildMainPrompt, buildPlayerInfoPrompt, formatPlayerInfo };
