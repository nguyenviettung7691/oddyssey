<template>
  <ion-app>
    <ion-router-outlet />
    <div id="oddyssey-google-signin" class="google-prompt-host"></div>
    <ScreenReaderAnnouncer />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import ScreenReaderAnnouncer from '@/components/ScreenReaderAnnouncer.vue';
import { useReducedMotion } from '@/composables/useReducedMotion';

// Initialize reduced motion support on app load
useReducedMotion();
</script>

<style>
.google-prompt-host {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
}
</style>
