# onepercent_taptap_generator 设计文档

中文名：**百分之一小作文生成工具**

版本：v1.0.0  

---

## 1. 项目背景

TapTap 游戏《百分之一》论坛活动要求用户围绕某款游戏撰写推荐类帖子，帖子需要符合活动指定格式，并包含游戏名称、发售平台、游玩时间、推荐人群、个人故事或推荐理由等内容。

本项目计划开发一个网页工具，用户只需要输入游戏名，并根据需要补充部分个性化字段，系统即可联网搜索该游戏的相关信息，并调用 AI 模型生成符合 TapTap 活动要求的帖子内容。

---

## 2. 项目基本信息

| 项目项 | 内容 |
|---|---|
| 项目名 | `onepercent_taptap_generator` |
| 中文名 | 百分之一小作文生成工具 |
| 项目类型 | Web 工具 / AI 内容生成工具 |
| 主要用途 | 根据游戏名自动生成符合《百分之一》TapTap 活动要求的帖子 |
| 技术栈 | Node.js + Vue + SQLite（可选） |
| 部署方式 | Docker / Docker Compose |
| 主要用户 | 参与 TapTap《百分之一》活动的普通用户 |
| 当前阶段 | 第一版功能设计 |

---

## 2.1 免责声明与使用边界

本项目仅用于软件开发、AI 工具研究与技术交流学习，主要用于探索 Web 应用开发、AI 内容生成、搜索服务整合、Docker 部署和开源项目维护流程。

本项目页面、提示词和生成内容可能涉及已上线游戏《百分之一》及 TapTap 活动相关信息。本项目不是《百分之一》官方产品，不代表游戏开发方、发行方或 TapTap 平台立场，也不提供任何商业化服务。

项目运行过程中获取或整理的公开资料仅用于学习、测试和内容生成演示。不得将本项目用于违规获取游戏资源、绕过平台或游戏规则、违规参与游戏活动、刷取奖励、伪造内容或其他可能损害游戏方、平台方及其他用户权益的行为。

使用者应遵守相关游戏、平台活动规则、版权、商标和社区规范。生成内容仅供参考，发布前请自行核对事实，并自行承担使用与发布责任。

页面打开时应以弹窗形式展示该免责声明，用户确认后才进入正常使用流程。

---

## 3. 活动内容理解

根据活动介绍，生成内容应尽量符合以下结构。

### 3.1 帖子标题格式

建议生成标题格式：

```text
〖我的百分之一〗+〖游戏名称〗
```

示例：

```text
〖我的百分之一〗+〖塞尔达传说：旷野之息〗
```

### 3.2 帖子正文核心字段

正文建议包含以下内容：

| 字段 | 说明 | 生成方式 |
|---|---|---|
| 游戏名称 | 用户输入的游戏名 | 用户必填 |
| 发售平台 | 游戏所在平台，如 PC、Switch、PS、手机等 | AI 联网搜索后自动生成，可允许用户手动补充 |
| 游玩时间 | 用户游玩该游戏的大致时长或时间段 | 默认 AI 生成，用户可选择手动输入 |
| 推荐人群 | 适合哪些玩家游玩 | AI 自动生成，可允许用户手动补充 |
| 个人故事 / 推荐理由 | 核心正文，说明为什么推荐该游戏 | AI 自动生成，可允许用户手动补充 |
| 许愿卡牌 | 如活动要求或用户想补充，可加入许愿内容 | AI 自动生成，可允许用户手动补充 |

---

## 4. 项目目标

### 4.1 核心目标

开发一个部署在服务器上的网页工具，实现以下功能：

1. 用户输入游戏名。
2. 程序联网搜索该游戏相关信息。
3. 程序根据活动要求构造提示词。
4. 调用 AI 模型生成符合 TapTap 活动格式的帖子。
5. 用户可复制生成结果并发布到 TapTap。
6. 页面适配 PC 和手机端，使用体验简洁美观。

---

## 5. 用户使用流程

### 5.1 基础流程

```text
打开网页
  ↓
输入游戏名称
  ↓
选择是否手动填写部分字段
  ↓
点击“生成帖子”
  ↓
后端联网搜索游戏资料
  ↓
后端调用 AI 模型生成帖子
  ↓
前端展示生成结果
  ↓
用户复制内容并发布到 TapTap
```

### 5.2 用户侧交互说明

页面中应包含一个游戏名称输入框，该字段为必填。

其他字段采用“可选手动输入”的方式。也就是说，默认情况下这些字段由 AI 自动生成；如果用户希望自己指定某些内容，可以勾选对应选项，展开输入框。

示例交互：

```text
游戏名称： [请输入游戏名]

□ 手动填写发售平台
   [请输入发售平台]

□ 手动填写游玩时间
   [请输入游玩时间，例如：大约 30 小时 / 从高中玩到现在 / 断断续续玩了三年]

□ 手动填写推荐人群
   [请输入推荐人群]

□ 手动填写个人故事或推荐理由
   [请输入你的真实感受、故事或推荐理由]

□ 手动填写许愿卡牌
   [请输入想许愿的卡牌名称或相关内容]

[生成帖子]
```

用户没有勾选的字段，后端统一交由 AI 自动补全。

---

## 6. 功能需求

## 6.1 首页 / 生成页面

### 6.1.1 功能说明

首页即核心生成页面，不单独拆分复杂功能模块。

页面应包含：

1. 项目标题：百分之一小作文生成工具。
2. 简短说明：输入游戏名，即可自动生成符合 TapTap 活动格式的推荐帖子。
3. 游戏名称输入框。
4. 可选字段展开区。
5. 生成按钮。
6. 生成中状态提示。
7. 生成结果展示区。
8. 一键复制按钮。
9. 重新生成按钮。
10. 错误提示区域。

### 6.1.2 页面风格

整体风格建议：

1. 简洁、明亮、偏游戏社区风格。
2. PC 端居中卡片布局。
3. 手机端单列布局。
4. 按钮和输入框保持圆角。
5. 生成结果使用类似帖子预览的卡片展示。
6. 不要过于复杂，优先保证实用性。

---

## 6.2 游戏信息搜索功能

### 6.2.1 功能说明

用户输入游戏名后，后端应尝试联网搜索该游戏的公开资料，为 AI 生成提供基础信息。

搜索内容可包括：

1. 游戏简介。
2. 发售平台。
3. 游戏类型。
4. 游戏特色。
5. TapTap、Steam、游戏官网、百科或新闻页面中的公开描述。
6. 玩家评价关键词。

### 6.2.2 搜索策略

第一版可采用简单搜索策略：

```text
游戏名 + 游戏 简介
游戏名 + 发售平台
游戏名 + TapTap
游戏名 + Steam
游戏名 + 评测
```

后端将搜索结果整理为简短上下文，传入 AI 提示词。

### 6.2.3 注意事项

1. 搜索结果不应直接大段复制。
2. 应只提取事实性信息和关键词。
3. 对不确定的信息，应让 AI 用“可能”“适合”等保守表达。
4. 如搜索失败，仍允许 AI 根据游戏名生成通用内容，但需要提示用户结果可能不够准确。

---

## 6.3 AI 帖子生成功能

### 6.3.1 功能说明

后端根据用户输入、可选字段和搜索结果，构造提示词并调用 AI 模型生成帖子。

生成内容应满足：

1. 符合活动标题格式。
2. 正文包含活动要求字段。
3. 语气自然，像真实玩家撰写。
4. 避免明显 AI 腔。
5. 不要过度夸张。
6. 不要编造过于具体、不可验证的经历。
7. 用户手动填写的内容必须优先保留，并自然融入正文。

### 6.3.2 生成结果结构

后端建议返回结构化 JSON，前端再进行展示。

示例：

```json
{
  "code": 200,
  "message": "生成成功",
  "data": {
    "title": "〖我的百分之一〗+〖游戏名称〗",
    "content": "正文内容……",
    "gameName": "游戏名称",
    "usedManualFields": ["playTime"],
    "searchSummary": "搜索到的游戏信息摘要……"
  }
}
```

---

## 6.4 可选字段逻辑

### 6.4.1 字段设计

| 字段名 | 前端显示 | 是否必填 | 默认生成方式 |
|---|---|---|---|
| gameName | 游戏名称 | 是 | 用户输入 |
| releasePlatform | 发售平台 | 否 | AI 自动生成 |
| playTime | 游玩时间 | 否 | AI 自动生成 |
| targetPlayers | 推荐人群 | 否 | AI 自动生成 |
| personalStory | 个人故事 / 推荐理由 | 否 | AI 自动生成 |
| wishCard | 许愿卡牌 | 否 | AI 自动生成 |

### 6.4.2 前端表单结构示例

```json
{
  "gameName": "百分之一",
  "manualFields": {
    "releasePlatform": {
      "enabled": false,
      "value": ""
    },
    "playTime": {
      "enabled": true,
      "value": "断断续续玩了半年左右"
    },
    "targetPlayers": {
      "enabled": false,
      "value": ""
    },
    "personalStory": {
      "enabled": false,
      "value": ""
    },
    "wishCard": {
      "enabled": false,
      "value": ""
    }
  }
}
```

### 6.4.3 后端处理规则

1. `gameName` 必须存在。
2. `manualFields.xxx.enabled = true` 时，必须读取对应 `value`。
3. 用户手动填写内容优先级高于 AI 搜索和 AI 自行发挥。
4. 未启用的字段，传入提示词中声明“请根据搜索结果和常识自然生成”。
5. 如果用户启用了某字段但未填写内容，前端应提示用户补充，或后端将其视为未启用。

---

## 7. 技术架构设计

## 7.1 总体架构

建议采用前后端分离架构：

```text
浏览器
  ↓
Vue 前端
  ↓ HTTP API
Node.js 后端
  ↓
联网搜索模块
  ↓
AI 模型调用模块
  ↓
返回生成结果
```

如需要记录生成历史或做基础限流，可引入 SQLite。

---

## 7.2 技术选型

| 模块 | 技术 | 说明 |
|---|---|---|
| 前端 | Vue 3 | 构建用户页面 |
| 构建工具 | Vite | 轻量、启动快 |
| UI | Element Plus / Naive UI / 自定义 CSS | 第一版可选其一 |
| 后端 | Node.js | 提供 API 服务 |
| 后端框架 | Express / Fastify | 推荐 Express，简单直观 |
| 数据库 | SQLite | 可选，用于生成记录和限流 |
| HTTP 请求 | axios / fetch | 调用搜索接口和 AI 接口 |
| 部署 | Docker Compose | 方便服务器部署 |
| 反向代理 | Nginx / 1Panel 网站反代 | 对外提供 HTTPS 访问 |

---

## 7.3 推荐目录结构

```text
onepercent_taptap_generator/
├── docker-compose.yml
├── README.md
├── design.md
├── .gitignore
├── .env.example
├── server/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   └── generate.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── searchService.js
│   │   │   └── promptService.js
│   │   ├── middlewares/
│   │   │   ├── rateLimit.js
│   │   │   └── errorHandler.js
│   │   └── db/
│   │       └── sqlite.js
│   └── data/
│       └── app.db
└── web/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── App.vue
        ├── api/
        │   └── generate.js
        ├── components/
        │   ├── GeneratorForm.vue
        │   ├── OptionalField.vue
        │   └── ResultCard.vue
        └── styles/
            └── main.css
```

---

## 8. 后端接口设计

## 8.1 生成帖子接口

### 请求地址

```http
POST /api/generate
```

### 请求参数

```json
{
  "gameName": "游戏名称",
  "manualFields": {
    "releasePlatform": {
      "enabled": false,
      "value": ""
    },
    "playTime": {
      "enabled": true,
      "value": "玩了大约 20 小时"
    },
    "targetPlayers": {
      "enabled": false,
      "value": ""
    },
    "personalStory": {
      "enabled": false,
      "value": ""
    },
    "wishCard": {
      "enabled": false,
      "value": ""
    }
  }
}
```

### 返回参数

```json
{
  "code": 200,
  "message": "生成成功",
  "data": {
    "title": "〖我的百分之一〗+〖游戏名称〗",
    "content": "生成的帖子正文",
    "searchSummary": "游戏信息摘要",
    "createdAt": "2026-05-26T00:00:00.000Z"
  }
}
```

### 错误返回

```json
{
  "code": 400,
  "message": "游戏名称不能为空"
}
```

```json
{
  "code": 429,
  "message": "生成过于频繁，请稍后再试"
}
```

```json
{
  "code": 500,
  "message": "生成失败，请稍后重试"
}
```

---

## 8.2 健康检查接口

### 请求地址

```http
GET /api/health
```

### 返回示例

```json
{
  "code": 200,
  "message": "ok"
}
```

该接口用于 Docker、反向代理或服务器监控判断服务是否正常。

---

## 9. AI 提示词设计

## 9.1 提示词目标

提示词应让 AI 明确知道：

1. 当前任务是生成 TapTap 活动帖子。
2. 帖子必须符合活动格式。
3. 用户手动填写字段必须保留。
4. 搜索到的信息只能作为参考。
5. 文风应像真实玩家，不要像广告文案。
6. 输出应直接给出标题和正文，不要解释生成过程。

---

## 9.2 提示词模板示例

```text
你是一个熟悉游戏社区发帖风格的中文写作助手。

现在需要根据 TapTap《百分之一》活动要求，帮用户生成一篇游戏推荐帖子。

活动帖子要求：
1. 标题格式为：〖我的百分之一〗+〖游戏名称〗
2. 正文需要包含：游戏名称、发售平台、游玩时间、推荐人群、个人故事/推荐理由等内容。
3. 如适合，可自然加入许愿卡牌相关内容。
4. 语气要像真实玩家分享，不要像广告，不要太像 AI 生成。
5. 内容应自然、真诚、有一点个人体验感。
6. 不要编造过于具体且明显不真实的经历。
7. 用户手动填写的字段必须优先保留，并自然融入正文。

用户输入：
游戏名称：{{gameName}}

用户手动填写字段：
{{manualFieldsText}}

联网搜索到的游戏信息摘要：
{{searchSummary}}

请生成：
1. 标题
2. 正文

输出格式：
标题：
……

正文：
……
```

---

## 9.3 手动字段拼接规则

如果用户勾选并填写了游玩时间，应在提示词中加入：

```text
游玩时间：用户明确填写为“断断续续玩了半年左右”，必须保留这个信息。
```

如果用户未勾选游玩时间，应在提示词中加入：

```text
游玩时间：用户未填写，请根据游戏类型和帖子语境自然生成，不要写得过于具体。
```

---

## 10. 限流与安全设计

虽然当前版本不设计用户登录和管理员后台，但仍建议加入基础限流，避免 API 被滥用。

## 10.1 限流目标

1. 防止同一 IP 高频调用生成接口。
2. 降低 AI API 成本风险。
3. 避免简单脚本刷接口。

## 10.2 第一版限流策略

可采用以下简单策略：

1. 按 IP 限流。
2. 每个 IP 每 10 分钟最多生成 3 次。
3. 每个 IP 每天最多生成 20 次。
4. 超出后返回 429。

如使用 SQLite，可记录：

```text
id
ip
userAgent
gameName
createdAt
```

## 10.3 注意事项

1. 不在前端暴露 AI API Key。
2. AI API Key 只保存在后端环境变量中。
3. `.env` 文件不得提交到 GitHub。
4. 公开仓库只提交 `.env.example`。
5. 后端需要限制请求体大小。
6. 前端输入需要进行基础长度限制。

## 10.4 前端使用限制展示

页面底部需要展示项目版本、使用限制、GitHub 仓库和开源协议。

使用限制不在前端写死，而是通过后端公开配置接口读取当前环境变量解析后的限流配置：

```text
GET /api/config
```

该接口只允许暴露可公开展示的运行配置，例如：

```json
{
  "rateLimit": {
    "enabled": true,
    "windowMinutes": 10,
    "windowMaxRequests": 3,
    "dailyMaxRequests": 20
  }
}
```

前端展示规则：

1. 底部只常驻显示“使用限制”四个字。
2. 鼠标悬停或键盘聚焦时，在标签上方展示具体限制。
3. 若接口不可用，降级展示“使用限制：按服务端配置”。
4. 不得通过该接口暴露 AI API Key、AI API Base URL、模型名称等敏感配置。

---

## 11. 环境变量设计

当前版本不设计网页端 API 管理，因此 AI 配置通过服务器环境变量完成。

`.env.example` 示例：

```env
NODE_ENV=production
PORT=3000

AI_API_BASE_URL=https://api.example.com/v1
AI_API_KEY=your_api_key_here
AI_MODEL=your_model_name_here

SEARCH_PROVIDER=basic
RATE_LIMIT_WINDOW_MINUTES=10
RATE_LIMIT_MAX_REQUESTS=3
```

说明：

| 变量 | 含义 |
|---|---|
| `PORT` | 后端服务端口 |
| `AI_API_BASE_URL` | AI 接口地址 |
| `AI_API_KEY` | AI API Key |
| `AI_MODEL` | 使用的模型名称 |
| `SEARCH_PROVIDER` | 搜索方式标识 |
| `RATE_LIMIT_WINDOW_MINUTES` | 限流时间窗口 |
| `RATE_LIMIT_MAX_REQUESTS` | 限流次数 |

---

## 12. Docker 部署设计

## 12.1 docker-compose.yml 示例

```yaml
services:
  server:
    build:
      context: ./server
    container_name: onepercent_taptap_generator_server
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./server/data:/app/data
    ports:
      - "3000:3000"

  web:
    build:
      context: ./web
    container_name: onepercent_taptap_generator_web
    restart: unless-stopped
    depends_on:
      - server
    ports:
      - "8080:80"
```

### 说明

1. `server` 负责 AI 调用、联网搜索和接口处理。
2. `web` 负责静态前端页面。
3. 外部访问建议通过 1Panel 或 Nginx 反向代理到 `web:80` 或宿主机 `8080`。
4. API 请求可由前端 Nginx 反代到后端 `server:3000`。

---

## 12.2 前端 Dockerfile 示例

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

---

## 12.3 后端 Dockerfile 示例

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]
```

---

## 12.4 前端 Nginx 反代配置示例

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://server:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 13. Git 与版本控制规范

## 13.1 分支建议

第一版可以使用简单分支策略：

```text
main      稳定可部署版本
dev       日常开发版本
```

后续复杂后可增加：

```text
feature/xxx
fix/xxx
```

---

## 13.2 提交频率要求

设计过程中采用严格版本控制。

要求：

1. 每完成一个功能点，立即提交 commit。
2. 每次修改重要逻辑后，立即提交 commit。
3. 每完成一个页面组件，立即提交 commit。
4. 每完成一个后端接口，立即提交 commit。
5. 每次提交后及时同步 GitHub 仓库。
6. 不要一次性堆积大量修改后再提交。

---

## 13.3 Commit Message 规范

采用如下格式：

```text
类型:中文描述
```

推荐类型：

| 类型 | 含义 |
|---|---|
| `feature` | 新功能 |
| `fix` | 问题修复 |
| `docs` | 文档修改 |
| `style` | 样式调整 |
| `refactor` | 代码重构 |
| `config` | 配置修改 |
| `deploy` | 部署相关 |
| `chore` | 其他杂项 |

示例：

```text
feature:初始化Vue前端项目
feature:新增游戏名称输入表单
feature:新增可选字段展开组件
feature:新增帖子生成接口
feature:接入AI帖子生成服务
feature:新增联网搜索服务
style:优化移动端页面布局
fix:修复空游戏名仍可提交的问题
config:新增docker-compose部署配置
docs:补充项目部署说明
```

---

## 13.4 推荐开发提交顺序

```text
docs:新增项目设计文档
feature:初始化项目目录结构
feature:初始化Vue前端项目
feature:初始化Node后端服务
feature:新增健康检查接口
feature:新增帖子生成表单
feature:新增可选字段输入组件
feature:新增帖子结果展示组件
feature:新增后端生成接口
feature:新增提示词构造服务
feature:新增游戏信息搜索服务
feature:接入AI模型调用服务
feature:新增基础IP限流
style:优化PC端和移动端页面样式
config:新增Docker部署配置
docs:新增README部署说明
```

---

## 14. 前端页面设计建议

## 14.1 页面布局

PC 端：

```text
页面背景
  └── 居中主卡片
        ├── 标题
        ├── 项目说明
        ├── 游戏名输入框
        ├── 可选字段区域
        ├── 生成按钮
        └── 结果展示卡片
```

移动端：

```text
单列布局
  ├── 标题
  ├── 说明
  ├── 输入区
  ├── 生成按钮
  └── 结果展示区
```

---

## 14.2 页面文案示例

标题：

```text
百分之一小作文生成工具
```

说明：

```text
输入一个游戏名，自动生成符合 TapTap《百分之一》活动格式的推荐帖子。
```

输入框占位符：

```text
请输入游戏名称，例如：星露谷物语
```

按钮：

```text
生成帖子
```

生成中：

```text
正在搜索游戏信息并生成帖子，请稍候……
```

复制成功：

```text
已复制，可以去 TapTap 发帖啦！
```

失败提示：

```text
生成失败，请稍后重试，或换一个游戏名试试。
```

---

## 14.3 结果展示格式

```text
标题：
〖我的百分之一〗+〖游戏名称〗

正文：
……
```

结果区按钮：

```text
复制全文
重新生成
```

---

## 15. 数据库设计（可选）

如果第一版只做简单限流，可使用 SQLite。

## 15.1 generation_logs 表

```sql
CREATE TABLE generation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  user_agent TEXT,
  game_name TEXT NOT NULL,
  success INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

用途：

1. 记录生成次数。
2. 支持 IP 限流。
3. 简单排查错误。

---

## 15.2 不建议第一版保存的内容

第一版不建议保存完整帖子正文，除非确有需要。

原因：

1. 减少隐私风险。
2. 降低数据库复杂度。
3. 避免用户误以为内容会被公开或长期保存。

如后续要保存历史记录，应在页面明确提示用户。

---

## 16. 开发阶段规划

## 16.1 第一阶段：项目初始化

目标：

1. 建立 GitHub 仓库。
2. 初始化目录结构。
3. 初始化 Vue 项目。
4. 初始化 Node.js 后端项目。
5. 编写基础 README。
6. 加入 Docker Compose 雏形。

交付物：

1. 可启动的前端页面。
2. 可启动的后端服务。
3. `/api/health` 可正常返回。

---

## 16.2 第二阶段：前端表单

目标：

1. 完成游戏名称输入框。
2. 完成可选字段勾选与展开输入。
3. 完成基础表单校验。
4. 完成生成按钮状态切换。

交付物：

1. 用户可以输入游戏名。
2. 用户可以选择是否手动填写字段。
3. 前端可向后端提交结构化 JSON。

---

## 16.3 第三阶段：后端生成接口

目标：

1. 完成 `/api/generate` 接口。
2. 完成请求参数校验。
3. 完成提示词构造。
4. 使用 mock AI 返回测试结果。

交付物：

1. 前后端打通。
2. 页面可展示 mock 帖子内容。

---

## 16.4 第四阶段：联网搜索与 AI 接入

目标：

1. 完成搜索模块。
2. 完成搜索结果摘要整理。
3. 完成 AI API 调用。
4. 完成错误处理和超时处理。

交付物：

1. 输入游戏名后可生成真实 AI 帖子。
2. 搜索失败时也有降级生成方案。

---

## 16.5 第五阶段：限流与部署

目标：

1. 加入基础 IP 限流。
2. 加入 SQLite 记录。
3. 完成 Dockerfile。
4. 完成 docker-compose.yml。
5. 完成服务器部署说明。

交付物：

1. 项目可通过 Docker Compose 部署。
2. 可通过 1Panel / Nginx 反向代理访问。
3. 具备基础防滥用能力。

---

## 17. 给 Codex / Claude Code 的开发提示词

可将以下内容作为初始开发提示词使用：

```text
请基于 design.md 开发项目 onepercent_taptap_generator，中文名为“百分之一小作文生成工具”。

要求：
1. 使用 Node.js + Vue 3 + SQLite（如需）技术栈。
2. 使用 Docker Compose 部署。
3. 当前版本不要开发管理员页面、API 管理页面、模型管理页面、API 测试页面。
4. 前端只需要用户侧生成页面。
5. 用户输入游戏名后，后端联网搜索游戏相关信息，并调用 AI 模型生成符合 TapTap《百分之一》活动要求的帖子。
6. 除游戏名外，发售平台、游玩时间、推荐人群、个人故事/推荐理由、许愿卡牌等字段都采用“勾选后手动填写，否则由 AI 自动生成”的交互方式。
7. 页面需要适配 PC 和移动端，界面简洁美观。
8. AI API Key 通过后端环境变量配置，不要暴露到前端。
9. 加入基础 IP 限流。
10. 每完成一个功能点都要提交 commit，commit message 使用“feature:中文描述”“fix:中文描述”等规范格式。
11. 每次 commit 后及时同步 GitHub 仓库。
12. 代码结构要清晰，前后端职责分离，便于后续继续扩展管理员后台。
```

---

## 18. 后续可扩展功能

当前版本暂不实现，但后续可以考虑：

1. 管理员后台。
2. 在线配置 AI 供应商和模型。
3. API Key 加密保存。
4. API 测试功能。
5. 多模型选择。
6. 生成历史记录。
7. 用户登录。
8. 生成风格选择，如“真诚分享”“轻松吐槽”“二次元口吻”等。
9. 一键跳转 TapTap 发帖页。
10. 对生成内容进行二次润色。
11. 多个候选版本同时生成。
12. 关键词敏感词检测。

---

## 19. 总结

`onepercent_taptap_generator` 是一个面向 TapTap《百分之一》活动的轻量级 AI 帖子生成工具。

当前版本重点是：

1. 快速完成用户侧核心功能。
2. 保持技术栈简单。
3. 支持 Docker 部署。
4. 保证 AI API Key 不暴露。
5. 通过基础限流控制成本。
6. 通过规范 Git 提交流程保证项目可维护。
7. 为后续管理员后台和模型管理功能预留扩展空间。

第一版不追求复杂后台能力，应优先实现“输入游戏名 → 搜索信息 → AI 生成帖子 → 用户复制发布”的完整闭环。
