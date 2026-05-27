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

  return `你是一个熟悉游戏社区发帖风格的中文写作助手。请根据玩家输入的游戏名称"${gameName}"生成一篇游戏推荐帖的正文内容。

【重要约束】
- 只把"${gameName}"当作游戏名称，不要使用活动标题格式或活动名称作为搜索、理解、生成的游戏关键词
- 不要输出帖子标题
- 不要输出"游戏名称："这一行，这一行会由程序固定填入玩家输入的游戏名称
- 不要改写、翻译、扩写或纠正玩家输入的游戏名称

【帖子结构】（按顺序写，不要输出段落标签，直接写内容）：

1. 先列出发售平台、游玩时间、推荐人群
2. 然后写游戏介绍和个人故事/推荐理由。这是最重要的部分，请务必写一段有真实感的个人体验，像真实玩家在论坛聊天分享。

【写作要求】
- 语气像真实玩家在论坛发帖分享，不要像广告或 AI 生成
- 个人故事要有一点细节感，但不能编造过于夸张的经历
- 不直接复制搜索信息，用自己的话表达
- 不要输出"标题：""正文："这类标记，直接输出帖子内容即可
- 不要写活动说明和玩家许愿信息，这些部分会另外处理
- 正文中提到游戏时，只能使用"${gameName}"这个名称

${searchSection}

用户手动填写的字段（必须原样保留）：
${manualLines.length > 0 ? manualLines.join('\n') : '（无）'}

需要自动生成的字段：
${autoLines.join('\n')}

请直接输出从"发售平台："开始的正文内容。`;
}

function formatPlayerInfo(playerInfo) {
  if (!playerInfo || !playerInfo.enabled) return '';

  const parts = [];
  if (playerInfo.wishCard.trim()) parts.push(`许愿卡牌：${playerInfo.wishCard.trim()}`);
  if (playerInfo.gameId.trim()) parts.push(`游戏ID：${playerInfo.gameId.trim()}`);
  if (playerInfo.accountId.trim()) parts.push(`账号ID：${playerInfo.accountId.trim()}`);
  if (playerInfo.server.trim()) parts.push(`区服：${playerInfo.server.trim()}`);

  return parts.length > 0 ? `\n\n${parts.join('\n')}` : '';
}

function stripGeneratedTitleAndGameName(text) {
  return (text || '')
    .replace(/^标题[：:].*$/gim, '')
    .replace(/^【我的百分之一】\s*\+\s*【.*?】\s*$/gim, '')
    .replace(/^游戏名称[：:].*$/gim, '')
    .replace(/^正文[：:]\s*/i, '')
    .trim();
}

function buildPostContent(gameName, generatedContent, playerInfo) {
  const body = stripGeneratedTitleAndGameName(generatedContent);
  const playerSection = formatPlayerInfo(playerInfo || {});

  return `游戏名称：${gameName}${body ? `\n${body}` : ''}${playerSection}`;
}

module.exports = {
  buildMainPrompt,
  buildPostContent,
  formatPlayerInfo,
  stripGeneratedTitleAndGameName,
};
