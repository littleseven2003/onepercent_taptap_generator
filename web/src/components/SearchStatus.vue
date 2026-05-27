<template>
  <section
    class="search-status"
    :class="`search-status--${normalized.status}`"
    aria-label="搜索状态"
  >
    <button
      class="search-status-trigger"
      type="button"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span class="search-status-icon" aria-hidden="true">
        <svg v-if="normalized.status === 'pending'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <svg v-else-if="normalized.status === 'success' || normalized.status === 'partial'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m20 6-11 11-5-5" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5" />
          <path d="M12 17h.01" />
        </svg>
      </span>
      <span class="search-status-copy">
        <strong>{{ title }}</strong>
        <small>{{ normalized.message }}</small>
      </span>
      <svg class="search-status-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div v-if="expanded" class="search-status-body">
      <p v-if="normalized.results.length === 0" class="search-status-empty">
        暂无可展示的搜索条目。
      </p>
      <ul v-else class="search-result-list">
        <li
          v-for="(item, index) in normalized.results"
          :key="`${item.query || item.title}-${index}`"
          class="search-result-item"
        >
          <span class="search-result-badge">{{ getItemLabel(item.status) }}</span>
          <div>
            <strong>{{ item.title || item.query || `搜索 ${index + 1}` }}</strong>
            <p>{{ item.content || getItemFallback(item.status) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  status: Object,
});

const expanded = ref(false);

watch(
  () => props.status,
  () => {
    expanded.value = false;
  },
  { deep: true }
);

const normalized = computed(() => ({
  status: props.status?.status || 'pending',
  message: props.status?.message || '正在搜索公开资料',
  results: Array.isArray(props.status?.results) ? props.status.results : [],
}));

const title = computed(() => {
  const map = {
    pending: '搜索状态',
    success: '搜索完成',
    partial: '搜索部分完成',
    empty: '未找到可用摘要',
    timeout: '搜索超时',
    failed: '搜索失败',
  };
  return map[normalized.value.status] || '搜索状态';
});

function getItemLabel(status) {
  const map = {
    success: '有效',
    empty: '无摘要',
    timeout: '超时',
    failed: '失败',
  };
  return map[status] || '状态';
}

function getItemFallback(status) {
  const map = {
    empty: '没有提取到可用摘要',
    timeout: '搜索请求超时',
    failed: '搜索请求失败',
  };
  return map[status] || '暂无摘要';
}
</script>
