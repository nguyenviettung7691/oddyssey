import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
const GamePage = () => import('@/views/GamePage.vue');
const ResultsPage = () => import('@/views/ResultsPage.vue');
const HighScoresPage = () => import('@/views/HighScoresPage.vue');
const ProfilePage = () => import('@/views/ProfilePage.vue');
const FriendsPage = () => import('@/views/FriendsPage.vue');
const ChallengesPage = () => import('@/views/ChallengesPage.vue');
const EventsPage = () => import('@/views/EventsPage.vue');
const EventDetailPage = () => import('@/views/EventDetailPage.vue');
const MatchmakingPage = () => import('@/views/MatchmakingPage.vue');

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
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsPage,
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: ChallengesPage,
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsPage,
  },
  {
    path: '/events/:eventId',
    name: 'EventDetail',
    component: EventDetailPage,
  },
  {
    path: '/matchmaking',
    name: 'Matchmaking',
    component: MatchmakingPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
