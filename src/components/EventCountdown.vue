<template>
  <div class="event-countdown" v-if="remaining > 0" role="timer" :aria-label="label + ': ' + formattedTime">
    <span class="countdown-label">{{ label }}</span>
    <span class="countdown-value">{{ formattedTime }}</span>
  </div>
  <div class="event-countdown ended" v-else role="status">
    <span class="countdown-label">{{ $t('events.eventEnded') }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  targetTime: string;
  label: string;
}>();

const now = ref(Date.now());
let interval: ReturnType<typeof setInterval> | null = null;

const remaining = computed(() => {
  const target = new Date(props.targetTime).getTime();
  return Math.max(0, target - now.value);
});

const formattedTime = computed(() => {
  const ms = remaining.value;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
});

onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<style scoped>
.event-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem;
}

.countdown-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ion-color-medium);
}

.countdown-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.ended .countdown-label {
  color: var(--ion-color-danger);
}
</style>
