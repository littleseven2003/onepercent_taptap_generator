<template>
  <div class="optional-field">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="enabled"
        :disabled="disabled"
        @change="$emit('update:enabled', $event.target.checked)"
      />
      <span>{{ label }}</span>
    </label>
    <input
      v-if="enabled"
      v-model="localValue"
      type="text"
      class="form-input optional-input"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  placeholder: String,
  enabled: Boolean,
  value: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:enabled', 'update:value']);

const localValue = computed({
  get: () => props.value,
  set: (val) => emit('update:value', val),
});
</script>
