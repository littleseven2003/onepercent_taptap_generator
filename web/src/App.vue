<template>
  <div class="shell">
    <div
      v-if="showDisclaimer"
      class="modal-backdrop"
      role="presentation"
    >
      <section
        class="disclaimer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-desc"
      >
        <header class="disclaimer-head">
          <span class="disclaimer-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="M9 12l2 2 4-5" />
            </svg>
          </span>
          <div>
            <p class="section-kicker">使用前请阅读</p>
            <h2 id="disclaimer-title">免责声明</h2>
          </div>
        </header>

        <div class="disclaimer-copy">
          <div id="disclaimer-desc">
            <p>
              本工具仅用于软件开发、AI 工具研究与技术交流学习，旨在探索 Web 开发、AI 内容生成、搜索服务整合与开源部署流程。
            </p>
            <p>
              本工具可能涉及已上线游戏《百分之一》及 TapTap 活动相关信息，但不是官方产品，不代表游戏开发方、发行方或 TapTap 平台立场，也不提供任何商业化服务。
            </p>
            <div class="disclaimer-rule">
              <strong>禁止用途</strong>
              <span>不得将本工具用于违规获取游戏资源、绕过平台或游戏规则、违规参与游戏活动、刷取奖励、伪造内容或其他可能损害游戏方、平台方及其他用户权益的行为。</span>
            </div>
            <div class="disclaimer-rule">
              <strong>用户责任</strong>
              <span>使用者应遵守相关游戏、平台活动规则、版权、商标和社区规范。生成内容仅供参考，发布前请自行核对事实，并自行承担使用与发布责任。</span>
            </div>
          </div>
          <button class="btn-disclaimer" type="button" @click="showDisclaimer = false">
            我已了解并继续
          </button>
        </div>
      </section>
    </div>

    <nav class="topbar" aria-label="主导航">
      <a href="/" class="brand" aria-label="首页">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 4h14v16H5z" />
            <path d="M8 8h8" />
            <path d="M8 12h5" />
            <path d="M8 16h7" />
          </svg>
        </span>
        <span>
          <strong>百分之一</strong>
          <small>TapTap 小作文生成器</small>
        </span>
      </a>

      <div class="nav-controls">
        <div class="palette-menu">
          <button
            class="icon-button"
            type="button"
            aria-label="选择主题配色"
            title="选择主题配色"
            :aria-expanded="paletteOpen"
            @click="paletteOpen = !paletteOpen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.6-3.2 1.4 1.4 0 0 1 1.1-2.3H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z" />
            </svg>
          </button>

          <div v-if="paletteOpen" class="palette-popover" role="menu" aria-label="主题配色">
            <button
              v-for="option in palettes"
              :key="option.value"
              class="palette-option"
              :class="{ 'palette-option--active': palette === option.value }"
              type="button"
              role="menuitemradio"
              :aria-checked="palette === option.value"
              @click="applyPalette(option.value)"
            >
              <span class="palette-swatch" :style="{ '--swatch-color': option.color }"></span>
              <span>{{ option.label }}</span>
            </button>
          </div>
        </div>

        <button
          class="icon-button"
          :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
          :title="theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
          </svg>
        </button>
      </div>
    </nav>

    <main class="workspace">
      <section class="intro-panel" aria-labelledby="page-title">
        <p class="eyebrow">OnePercent TapTap Generator</p>
        <h1 id="page-title">百分之一帖子生成器</h1>
        <p class="intro-copy">
          输入游戏名，补充你想保留的真实信息，后端会搜索公开资料并生成符合《我的百分之一》活动格式的帖子。
        </p>
      </section>

      <section class="composer-layout">
        <GeneratorForm ref="formRef" :loading="loading" @submit="handleGenerate" />

        <aside class="output-panel" aria-live="polite">
          <SearchStatus
            v-if="searchStatus"
            :status="searchStatus"
          />

          <ResultCard
            v-if="result"
            :result="result"
            @regenerate="handleRegenerate"
          />
          <div v-else-if="loading" class="loading-card">
            <div class="loading-header">
              <span class="spinner" role="status" aria-label="加载中"></span>
              <strong>正在生成帖子</strong>
            </div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton skeleton-short"></div>
          </div>
          <EmptyState v-else-if="!error" @tryExample="handleTryExample" />
        </aside>
      </section>

      <div
        v-if="error"
        :class="['toast', errorType === 'warn' ? 'toast--warn' : 'toast--error']"
        role="alert"
      >
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5" />
          <path d="M12 17h.01" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <footer class="site-footer" aria-label="项目信息">
        <div class="footer-card">
          <span class="footer-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h10" />
            </svg>
            版本 v1.0.0
          </span>
          <span
            class="footer-item footer-tooltip"
            tabindex="0"
            :aria-label="usageLimitText"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="M9 12l2 2 4-5" />
            </svg>
            使用限制
            <span class="footer-tooltip-bubble" role="tooltip">
              {{ usageLimitText }}
            </span>
          </span>
          <a
            class="footer-item"
            href="https://github.com/littleseven2003/onepercent_taptap_generator"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.94c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
            </svg>
            GitHub 仓库
          </a>
          <a
            class="footer-item"
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v5h5" />
              <path d="M9 15h6" />
              <path d="M9 18h4" />
            </svg>
            GPL-3.0
          </a>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GeneratorForm from './components/GeneratorForm.vue';
import ResultCard from './components/ResultCard.vue';
import EmptyState from './components/EmptyState.vue';
import SearchStatus from './components/SearchStatus.vue';
import { generatePost, getRuntimeConfig } from './api/generate';

const loading = ref(false);
const result = ref(null);
const searchStatus = ref(null);
const error = ref('');
const errorType = ref('error');
const theme = ref('light');
const palette = ref('violet');
const paletteOpen = ref(false);
const formRef = ref(null);
const usageLimitText = ref('使用限制：按服务端配置');
const showDisclaimer = ref(true);

const THEME_STORAGE_KEY = 'onepercent-theme';
const PALETTE_STORAGE_KEY = 'onepercent-palette';
const palettes = [
  { value: 'violet', label: '紫藤', color: '#6d28d9' },
  { value: 'blue', label: '海蓝', color: '#2563eb' },
  { value: 'green', label: '薄荷', color: '#059669' },
  { value: 'rose', label: '莓果', color: '#e11d48' },
];

function applyTheme(t) {
  theme.value = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(THEME_STORAGE_KEY, t);
}

function applyPalette(p) {
  palette.value = p;
  paletteOpen.value = false;
  document.documentElement.setAttribute('data-palette', p);
  localStorage.setItem(PALETTE_STORAGE_KEY, p);
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  }

  const savedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
  if (palettes.some((item) => item.value === savedPalette)) {
    applyPalette(savedPalette);
  } else {
    applyPalette(palette.value);
  }

  loadRuntimeConfig();
});

async function loadRuntimeConfig() {
  try {
    const res = await getRuntimeConfig();
    usageLimitText.value = formatUsageLimit(res.data.data.rateLimit);
  } catch {
    usageLimitText.value = '使用限制：按服务端配置';
  }
}

function formatUsageLimit(rateLimit) {
  if (!rateLimit?.enabled) {
    return '使用限制：当前未开启';
  }

  const parts = [];
  if (rateLimit.windowMinutes > 0 && rateLimit.windowMaxRequests > 0) {
    parts.push(`${rateLimit.windowMinutes}分钟${rateLimit.windowMaxRequests}次`);
  }
  if (rateLimit.dailyMaxRequests > 0) {
    parts.push(`每日${rateLimit.dailyMaxRequests}次`);
  }

  return `使用限制：${parts.length ? parts.join('，') : '当前未开启'}`;
}

async function handleGenerate(payload) {
  loading.value = true;
  error.value = '';
  errorType.value = 'error';
  result.value = null;
  searchStatus.value = {
    status: 'pending',
    message: '正在搜索公开资料，稍后会展示搜索结果',
    results: [],
  };

  try {
    const res = await generatePost(payload);
    result.value = res.data.data;
    searchStatus.value = res.data.data.searchStatus || {
      status: res.data.data.searchSummary ? 'success' : 'empty',
      message: res.data.data.searchSummary ? '搜索完成，已提取摘要' : '没有搜索到可用摘要，已改用通用生成方式',
      results: res.data.data.searchSummary
        ? [{ status: 'success', title: '搜索摘要', content: res.data.data.searchSummary }]
        : [],
    };
  } catch (err) {
    searchStatus.value = {
      status: 'failed',
      message: '生成请求失败，未能完成搜索结果展示',
      results: [],
    };

    const status = err.response?.status;
    const msg = err.response?.data?.message;

    if (status === 429) {
      errorType.value = 'warn';
      error.value = msg || '请求过于频繁，请稍后再试';
    } else if (status && msg) {
      error.value = msg;
    } else if (err.code === 'ECONNABORTED') {
      error.value = '请求超时，AI 响应时间较长，请换一个游戏名试试';
    } else if (!err.response) {
      error.value = '网络异常，请检查后端服务是否正常运行';
    } else {
      error.value = '生成失败，请稍后重试，或换一个游戏名试试';
    }
  } finally {
    loading.value = false;
  }
}

function handleRegenerate() {
  result.value = null;
  searchStatus.value = null;
  error.value = '';
}

function handleTryExample(example) {
  formRef.value?.setGameName(example);
  error.value = '';
}
</script>
