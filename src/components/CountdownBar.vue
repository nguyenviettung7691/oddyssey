<template>
  <div class="timer-shell">
    <div class="timer-track"></div>
    <div class="timer-fill" :style="fillStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  total: number;
  remaining: number;
  accentColor?: string;
}>();

const fillStyle = computed(() => {
  const percent = props.total > 0 ? (props.remaining / props.total) * 100 : 0;
  return {
    width: `${Math.max(0, Math.min(100, percent))}%`,
    background: props.accentColor ?? 'var(--oddyssey-accent, #ff8c42)',
  };
});
</script>

<style scoped>
.timer-shell {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.timer-track {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.04);
}

.timer-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width 0.3s ease;
}
</style>
