<template>
  <div class="result-card">
    <div class="result-topline">
      <span class="result-status">已生成</span>
      <span class="meta-item">{{ wordCount }} 字</span>
    </div>

    <div v-if="result.searchSummary" class="search-card">
      <div class="search-card-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span>搜索摘要</span>
      </div>
      <p>{{ result.searchSummary }}</p>
    </div>

    <article class="preview-card">
      <h2>{{ result.title }}</h2>
      <div class="preview-body">{{ result.content }}</div>
    </article>

    <div class="result-actions">
      <button
        class="btn btn--copy"
        :class="{ 'btn--copied': copied }"
        type="button"
        :aria-label="copied ? '已复制' : '复制全文'"
        @click="handleCopy"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m20 6-11 11-5-5" />
        </svg>
        {{ copied ? '已复制' : '复制全文' }}
      </button>
      <button class="btn btn--retry" type="button" @click="$emit('regenerate')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        重新生成
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  result: Object,
});

defineEmits(['regenerate']);

const copied = ref(false);

const wordCount = computed(() => {
  const text = props.result?.content || '';
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const words = (text.match(/[a-zA-Z]+/g) || []).length;
  return cjk + words;
});

async function handleCopy() {
  const text = `${props.result.title}\n\n${props.result.content}`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 3000);
}
</script>
