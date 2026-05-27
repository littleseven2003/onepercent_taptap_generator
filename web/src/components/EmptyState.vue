<template>
  <div class="empty-state">
    <div class="empty-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    </div>
    <p class="empty-title">等待第一篇草稿</p>
    <p class="empty-desc">右侧会展示搜索摘要、帖子预览、字数统计和复制操作。</p>
    <div class="example-row" aria-label="示例游戏">
      <button
        v-for="example in examples"
        :key="example"
        class="example-chip"
        type="button"
        @click="$emit('tryExample', example)"
      >
        {{ example }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['tryExample']);

const examples = ['星露谷物语', '空洞骑士', '塞尔达传说', '原神'];
</script>
