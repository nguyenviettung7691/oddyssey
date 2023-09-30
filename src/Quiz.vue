<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['finish']);

const questions = [
  {
    question: "What is the capital of Vietnam?",
    options: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue"],
    answer: "Hanoi"
  },
  {
    question: "Which programming language is commonly used for web development?",
    options: ["Java", "Python", "JavaScript", "C++"],
    answer: "JavaScript"
  },
  {
    question: "Which river runs through Ho Chi Minh City?",
    options: ["Mekong River", "Red River", "Sai Gon River", "Thu Bon River"],
    answer: "Sai Gon River"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
    answer: "Blue Whale"
  },
  {
    question: "Which CSS property is used to change the text color of an element?",
    options: ["background-color", "color", "font-size", "margin"],
    answer: "color"
  },
  {
    question: "Which of the following is not a front-end JavaScript framework?",
    options: ["React", "Angular", "Vue.js", "Django"],
    answer: "Django"
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Highly Typed Multiline Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which famous scientist is known for the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
    answer: "Albert Einstein"
  },
  {
    question: "In which year was the World Wide Web (WWW) created?",
    options: ["1980", "1995", "2000", "1989"],
    answer: "1989"
  },
  {
    question: "What is the symbol for the element gold in the periodic table?",
    options: ["Au", "Ag", "Fe", "Hg"],
    answer: "Au"
  }
];

const statusAnswer = ref(0);
const statusResult = ref(0);

const currentIndex = ref(0);
const currentQuestion = computed(() => {
  return questions[currentIndex.value];
});
const currentAnswer = ref('');
const answers = ref(0);

const progressStyle = computed(() => {
  return {
    background: 
        `radial-gradient(closest-side, white 79%, transparent 80% 100%),
        conic-gradient(green ${answers.value * 100 / questions.length}%, red 0)`
  };
})

function clickHandler(){
  if(statusAnswer.value == 0){
    if(currentAnswer.value == currentQuestion.value.answer){
      statusResult.value = 1;
      answers.value += 1;
    } else {
      statusResult.value = 0;
    }
    statusAnswer.value = 1;
  } else if(statusAnswer.value == 1){
    if(currentIndex.value == questions.length - 1) {
      emit('finish', answers.value, questions.length);
      statusAnswer.value = 2;
    } else {
      statusAnswer.value = 0;
      currentAnswer.value = '';
      currentIndex.value += 1;
    }
  }
}
</script>
<template>
  <div v-if="statusAnswer != 2" class="progress-bar" role="progressbar" :aria-valuenow="answers" aria-valuemin="0" :aria-valuemax="questions.length" :style="progressStyle">
    <span>{{ answers }}</span>
  </div>
  <div v-if="statusAnswer != 2" class="flex flex-col text-white">
    <h1 class="text-2xl p-2 border-b-2 border-white mb-2">{{ currentQuestion.question }}</h1>
    <label v-for="option in currentQuestion.options" :class="['flex items-center gap-2 m-2', {'font-bold': (option == currentQuestion.answer) && statusAnswer}]">
      <input type="radio" :name="currentIndex" :value="option" v-model="currentAnswer" :disabled="statusAnswer">
      <span>{{ option }}</span>
    </label>
    <div class="flex items-center gap-2">
      <div v-show="statusAnswer" class="flex-grow text-center">
        <div v-show="statusResult" class="bg-green-900 border-2 border-green-500 text-green-500 p-2">Correct</div>
        <div v-show="!statusResult" class="bg-red-900 border-2 border-red-500 text-red-500 p-2">Incorrect</div>
      </div>
      <button type="button" v-show="currentAnswer" @click="clickHandler" class="ml-auto bg-sky-500 rounded p-3">
        <span v-show="!statusAnswer">Submit</span>
        <span v-show="statusAnswer">Next</span>
      </button>
    </div>
  </div>
</template>
