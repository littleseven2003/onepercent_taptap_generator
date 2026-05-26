<template>
  <div class="generator-form">
    <div class="form-group">
      <label class="form-label">游戏名称 <span class="required">*</span></label>
      <input
        v-model="form.gameName"
        type="text"
        class="form-input"
        placeholder="请输入游戏名称，例如：星露谷物语"
        :disabled="loading"
        @keyup.enter="$emit('submit', buildPayload())"
      />
    </div>

    <OptionalField
      v-for="field in optionalFields"
      :key="field.key"
      :label="field.label"
      :placeholder="field.placeholder"
      :disabled="loading"
      v-model:enabled="form.manualFields[field.key].enabled"
      v-model:value="form.manualFields[field.key].value"
    />

    <button
      class="btn-generate"
      :disabled="loading || !form.gameName.trim()"
      @click="$emit('submit', buildPayload())"
    >
      <span v-if="loading" class="spinner"></span>
      {{ loading ? '正在搜索游戏信息并生成帖子，请稍候……' : '生成帖子' }}
    </button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import OptionalField from './OptionalField.vue';

defineProps({
  loading: Boolean,
});

const emit = defineEmits(['submit']);

const optionalFields = [
  { key: 'releasePlatform', label: '手动填写发售平台', placeholder: '例如：PC、Switch、PS、手机' },
  { key: 'playTime', label: '手动填写游玩时间', placeholder: '例如：大约 30 小时 / 从高中玩到现在 / 断断续续玩了三年' },
  { key: 'targetPlayers', label: '手动填写推荐人群', placeholder: '例如：喜欢开放世界的玩家、解谜爱好者' },
  { key: 'personalStory', label: '手动填写个人故事或推荐理由', placeholder: '请输入你的真实感受、故事或推荐理由' },
  { key: 'wishCard', label: '手动填写许愿卡牌', placeholder: '请输入想许愿的卡牌名称或相关内容' },
];

const form = reactive({
  gameName: '',
  manualFields: {
    releasePlatform: { enabled: false, value: '' },
    playTime: { enabled: false, value: '' },
    targetPlayers: { enabled: false, value: '' },
    personalStory: { enabled: false, value: '' },
    wishCard: { enabled: false, value: '' },
  },
});

function buildPayload() {
  return {
    gameName: form.gameName.trim(),
    manualFields: JSON.parse(JSON.stringify(form.manualFields)),
  };
}
</script>
