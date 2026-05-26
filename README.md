# 百分之一小作文生成工具

一款 Web 工具，输入游戏名即可自动生成符合 TapTap《我的百分之一》活动格式的推荐帖子。

## 功能

- 输入游戏名，联网搜索游戏信息
- 调用 AI 模型生成符合活动格式的帖子
- 支持手动填写可选字段（发售平台、游玩时间、推荐人群、个人故事、许愿卡牌）
- 一键复制全文
- 适配 PC 和移动端

## 技术栈

- 前端：Vue 3 + Vite
- 后端：Node.js + Express
- 数据库：SQLite（限流记录）
- 部署：Docker Compose

## 快速开始

### 环境准备

```bash
cp .env.example .env
# 编辑 .env，填入 AI API 配置
```

### 本地开发

```bash
# 启动后端
cd server && npm install && npm run dev

# 启动前端（新终端）
cd web && npm install && npm run dev
```

访问 http://localhost:5173

### Docker 部署

```bash
docker compose up -d
```

访问 http://localhost:8080

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 后端端口 | `3000` |
| `AI_API_BASE_URL` | AI API 地址 | - |
| `AI_API_KEY` | AI API Key | - |
| `AI_MODEL` | 模型名称 | `gpt-3.5-turbo` |
| `RATE_LIMIT_WINDOW_MINUTES` | 限流窗口（分钟） | `10` |
| `RATE_LIMIT_MAX_REQUESTS` | 窗口内最大次数 | `3` |
| `RATE_LIMIT_DAILY_MAX` | 每日最大次数 | `20` |

未配置 AI_API_KEY 时，将使用 mock 模式返回示例内容。

## 活动格式

生成的帖子格式参考 TapTap《我的百分之一》活动要求：

- 标题格式：【我的百分之一】+【游戏名称】
- 正文包含：游戏名称、发售平台、游玩时间、推荐人群、个人故事/推荐理由、许愿卡牌

## License

MIT
