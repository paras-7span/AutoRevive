export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-directus', '@nuxt/image'],
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


  compatibilityDate: '2025-01-15'

})