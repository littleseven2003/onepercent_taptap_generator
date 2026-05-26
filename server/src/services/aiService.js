const axios = require('axios');

const AI_TIMEOUT = 120000;

async function callAI(prompt) {
  const baseURL = process.env.AI_API_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

  if (!apiKey || apiKey === 'your_api_key_here') {
    return null;
  }

  const response = await axios.post(
    `${baseURL}/chat/completions`,
    {
      model,
      messages: [
        { role: 'system', content: '你是一个中文写作助手，请严格按照用户要求的格式输出。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: AI_TIMEOUT,
    }
  );

  return response.data.choices?.[0]?.message?.content || null;
}

function parseAIResponse(text) {
  let title = '';
  let body = text;

  const titleMatch = text.match(/^(.+【我的百分之一】.+\+【.+】.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
    body = text.slice(titleMatch[0].length).trim();
  }

  body = body.replace(/^正文[：:]\s*/i, '').trim();

  return title
    ? { title, content: body }
    : { title: '', content: text.trim() };
}

function getMockResponse(gameName) {
  return {
    title: `【我的百分之一】+【${gameName}】`,
    content: `什么是【我的百分之一】？这里是活动链接：https://www.taptap.cn/moment/371075389700702390

游戏名称：《${gameName}》
游戏当时发售平台：PC / Switch
玩游戏的时间：断断续续玩了快两年
推荐人群：喜欢沉浸式体验、不追求快餐节奏的玩家

今天想和大家聊聊《${gameName}》这款游戏。说来也巧，最初接触还是朋友安利的，那时候我对这类游戏并不是特别感兴趣，只是抱着试试看的心态下载了。结果一玩就是几十个小时，完全停不下来。

游戏的画面风格独特，音乐也很抓耳，系统设计得相当有深度。印象最深的是有一次通关后那种意犹未尽的感觉，好久没有游戏能让我这样沉浸其中了。如果你也喜欢这种类型，强烈推荐试试看。

最后许个愿吧——希望能拿到一张六星卡牌「雷之炼金术师」！游戏ID：123456789，账号ID：987654321，安卓。

（此为 mock 示例，配置 AI API 后将生成真实内容）`,
  };
}

module.exports = { callAI, parseAIResponse, getMockResponse };
