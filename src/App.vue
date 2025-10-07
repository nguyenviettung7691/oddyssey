<template>
  <ion-app>
    <ion-router-outlet />
    <div id="oddyssey-google-signin" class="google-prompt-host"></div>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>
.google-prompt-host {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
}
</style>
