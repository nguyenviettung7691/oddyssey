import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { IonicVue } from '@ionic/vue'
import { createI18n } from 'vue-i18n'
import HomePage from '@/views/HomePage.vue'
import { describe, expect, test } from 'vitest'
import en from '@/i18n/locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('HomePage.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [createPinia(), router, IonicVue, i18n],
      },
    })
    expect(wrapper.text()).toContain('Find the Odd One Out.')
  })
})
