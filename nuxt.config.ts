export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-directus', '@nuxt/image', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      assetsUrl: 'https://directus-dj3o.onrender.com/assets',
      directus: {
        url: 'https://directus-dj3o.onrender.com'
      }
    }
  },

  devtools: {
    enabled: true
  },



  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  compatibilityDate: '2025-01-15'

})