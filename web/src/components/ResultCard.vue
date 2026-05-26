<template>
  <div class="result-card">
    <div v-if="result.searchSummary" class="search-card">
      <div class="search-header">
        <span class="search-icon">&#128269;</span>
        <span>搜索到的游戏信息</span>
      </div>
      <div class="search-body">{{ result.searchSummary }}</div>
    </div>

    <div class="result-preview">
      <div class="result-title">{{ result.title }}</div>
      <div class="result-body">{{ result.content }}</div>
    </div>

    <div class="result-actions">
      <button class="btn-copy" @click="handleCopy">
        {{ copied ? '已复制，可以去 TapTap 发帖啦！' : '复制全文' }}
      </button>
      <button class="btn-retry" @click="$emit('regenerate')">重新生成</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  result: Object,
});

defineEmits(['regenerate']);

const copied = ref(false);

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
