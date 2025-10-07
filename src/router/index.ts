import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
const GamePage = () => import('@/views/GamePage.vue');
const ResultsPage = () => import('@/views/ResultsPage.vue');
const HighScoresPage = () => import('@/views/HighScoresPage.vue');
const ProfilePage = () => import('@/views/ProfilePage.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/game',
    name: 'Game',
    component: GamePage,
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsPage,
  },
  {
    path: '/highscores',
    name: 'HighScores',
    component: HighScoresPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
