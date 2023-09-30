<script setup>
import { ref } from 'vue';
import Quiz from './Quiz.vue';

const result = ref(0);

function finishHandler(correct, total){
    result.value = [correct, total];
}
</script>
<template>
    <Quiz v-show="!result" @finish="finishHandler"></Quiz>
    <div v-show="result" class="text-white text-2xl">Your final score: {{ result[0] }} out of {{ result[1] }}</div>
</template>
