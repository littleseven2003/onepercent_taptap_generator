<template>
  <div class="app">
    <header class="header">
      <h1 class="title">百分之一小作文生成工具</h1>
      <p class="subtitle">输入一个游戏名，自动生成符合 TapTap《我的百分之一》活动格式的推荐帖子</p>
    </header>
    <main class="main">
      <GeneratorForm
        :loading="loading"
        @submit="handleGenerate"
      />
      <ResultCard
        v-if="result"
        :result="result"
        @regenerate="handleRegenerate"
      />
      <div v-if="error" class="error-msg">{{ error }}</div>
    </main>
    <footer class="footer">
      <p>仅供学习交流，请勿用于违规用途</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GeneratorForm from './components/GeneratorForm.vue';
import ResultCard from './components/ResultCard.vue';
import { generatePost } from './api/generate';

const loading = ref(false);
const result = ref(null);
const error = ref('');

async function handleGenerate(payload) {
  loading.value = true;
  error.value = '';
  result.value = null;

  try {
    const res = await generatePost(payload);
    result.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || '生成失败，请稍后重试，或换一个游戏名试试。';
  } finally {
    loading.value = false;
  }
}

function handleRegenerate() {
  result.value = null;
  error.value = '';
}
</script>
