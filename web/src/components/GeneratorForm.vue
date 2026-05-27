<template>
  <form class="form-card" @submit.prevent="$emit('submit', buildPayload())">
    <div class="form-head">
      <div>
        <p class="section-kicker">输入区</p>
        <h2>帖子素材</h2>
      </div>
      <span class="field-count">{{ advancedFieldsUsed }} 项已补充</span>
    </div>

    <div class="form-group">
      <label class="field-label" for="gameName">游戏名称 <span>*</span></label>
      <div class="input-wrapper">
        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="gameName"
          ref="gameInput"
          v-model="form.gameName"
          type="text"
          class="text-input text-input--with-icon"
          placeholder="例如：星露谷物语"
          :disabled="loading"
          autocomplete="off"
        />
      </div>
    </div>

    <div class="accordion" :class="{ 'accordion--open': advancedOpen }">
      <button
        type="button"
        class="accordion-trigger"
        :disabled="loading"
        :aria-expanded="advancedOpen"
        @click="advancedOpen = !advancedOpen"
      >
        <span class="trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span>手动补充信息</span>
        <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div class="accordion-panel">
        <OptionalField
          v-for="field in optionalFields"
          :key="field.key"
          :label="field.label"
          :placeholder="field.placeholder"
          :disabled="loading"
          v-model:enabled="form.manualFields[field.key].enabled"
          v-model:value="form.manualFields[field.key].value"
        />

        <fieldset class="player-field">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="form.manualFields.playerInfo.enabled"
              :disabled="loading"
            />
            <span>玩家信息与许愿卡牌</span>
          </label>
          <div v-if="form.manualFields.playerInfo.enabled" class="player-grid">
            <label>
              <span>许愿卡牌</span>
              <input v-model="form.manualFields.playerInfo.wishCard" type="text" class="text-input" placeholder="卡牌名称" :disabled="loading" />
            </label>
            <label>
              <span>游戏 ID</span>
              <input v-model="form.manualFields.playerInfo.gameId" type="text" class="text-input" placeholder="游戏内 ID" :disabled="loading" />
            </label>
            <label>
              <span>账号 ID</span>
              <input v-model="form.manualFields.playerInfo.accountId" type="text" class="text-input" placeholder="账号 ID" :disabled="loading" />
            </label>
            <label>
              <span>区服</span>
              <input v-model="form.manualFields.playerInfo.server" type="text" class="text-input" placeholder="安卓 / 苹果" :disabled="loading" />
            </label>
          </div>
        </fieldset>
      </div>
    </div>

    <button class="btn-generate" type="submit" :disabled="loading || !form.gameName.trim()">
      <span v-if="loading" class="mini-spinner" role="status" aria-label="加载中"></span>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
      </svg>
      {{ loading ? '正在搜索并生成' : '生成帖子' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, computed, nextTick } from 'vue';
import OptionalField from './OptionalField.vue';

defineProps({
  loading: Boolean,
});

defineEmits(['submit']);

const gameInput = ref(null);
const advancedOpen = ref(false);

const optionalFields = [
  { key: 'releasePlatform', label: '发售平台', placeholder: '例如：PC、Switch、PS、手机' },
  { key: 'playTime', label: '游玩时间', placeholder: '例如：大约 30 小时 / 从高中玩到现在' },
  { key: 'targetPlayers', label: '推荐人群', placeholder: '例如：喜欢开放世界的玩家、解谜爱好者' },
  { key: 'personalStory', label: '个人故事或推荐理由', placeholder: '请输入你的真实感受、故事或推荐理由' },
];

const form = reactive({
  gameName: '',
  manualFields: {
    releasePlatform: { enabled: false, value: '' },
    playTime: { enabled: false, value: '' },
    targetPlayers: { enabled: false, value: '' },
    personalStory: { enabled: false, value: '' },
    playerInfo: {
      enabled: false,
      wishCard: '',
      gameId: '',
      accountId: '',
      server: '',
    },
  },
});

const advancedFieldsUsed = computed(() => {
  let count = 0;
  for (const k of ['releasePlatform', 'playTime', 'targetPlayers', 'personalStory']) {
    if (form.manualFields[k].enabled && form.manualFields[k].value.trim()) count++;
  }
  if (form.manualFields.playerInfo.enabled) count++;
  return count;
});

function buildPayload() {
  return {
    gameName: form.gameName.trim(),
    manualFields: JSON.parse(JSON.stringify(form.manualFields)),
  };
}

async function setGameName(name) {
  form.gameName = name;
  await nextTick();
  gameInput.value?.focus();
}

defineExpose({ setGameName });
</script>
