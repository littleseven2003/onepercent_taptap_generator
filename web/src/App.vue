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
      <div v-if="error" :class="errorType === 'warn' ? 'warn-msg' : 'error-msg'">{{ error }}</div>
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
const errorType = ref('error');

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
</script>
