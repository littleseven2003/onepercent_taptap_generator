<template>
  <div class="shell">
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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GeneratorForm from './components/GeneratorForm.vue';
import ResultCard from './components/ResultCard.vue';
import EmptyState from './components/EmptyState.vue';
import SearchStatus from './components/SearchStatus.vue';
import { generatePost } from './api/generate';

const loading = ref(false);
const result = ref(null);
const searchStatus = ref(null);
const error = ref('');
const errorType = ref('error');
const theme = ref('light');
const palette = ref('violet');
const paletteOpen = ref(false);
const formRef = ref(null);

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
});

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
