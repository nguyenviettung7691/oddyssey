<template>
  <div class="sr-only" aria-live="polite" aria-atomic="true">{{ politeMessage }}</div>
  <div class="sr-only" aria-live="assertive" aria-atomic="true">{{ assertiveMessage }}</div>
</template>

<script setup lang="ts">
import { useAnnouncer } from '@/composables/useAnnouncer';

const { politeMessage, assertiveMessage } = useAnnouncer();
</script>
