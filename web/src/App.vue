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
    </nav>

    <main class="workspace">
      <section class="intro-panel" aria-labelledby="page-title">
        <p class="eyebrow">AI game post studio</p>
        <h1 id="page-title">把游戏名变成一篇能发的 TapTap 推荐帖</h1>
        <p class="intro-copy">
          输入游戏名，补充你想保留的真实信息，后端会搜索公开资料并生成符合《我的百分之一》活动格式的帖子。
        </p>
        <div class="status-strip" aria-label="生成流程">
          <span>搜索资料</span>
          <span>组织经历</span>
          <span>复制发布</span>
        </div>
      </section>

      <section class="composer-layout">
        <GeneratorForm ref="formRef" :loading="loading" @submit="handleGenerate" />

        <aside class="output-panel" aria-live="polite">
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
import { generatePost } from './api/generate';

const loading = ref(false);
const result = ref(null);
const error = ref('');
const errorType = ref('error');
const theme = ref('light');
const formRef = ref(null);

const STORAGE_KEY = 'onepercent-theme';

function applyTheme(t) {
  theme.value = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(STORAGE_KEY, t);
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark');
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  }
});

async function handleGenerate(payload) {
  loading.value = true;
  error.value = '';
  errorType.value = 'error';
  result.value = null;

  try {
    const res = await generatePost(payload);
    result.value = res.data.data;
  } catch (err) {
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
  error.value = '';
}

function handleTryExample(example) {
  formRef.value?.setGameName(example);
  error.value = '';
}
</script>
