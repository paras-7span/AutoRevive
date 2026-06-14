export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    'nuxt-directus',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  runtimeConfig: {
    public: {
      assetsUrl: 'https://directus-dj3o.onrender.com/assets',
      directus: {
        url: 'https://directus-dj3o.onrender.com'
      }
    }
  },

 pwa: {
    registerType: 'autoUpdate',

    injectRegister: 'auto',

    manifest: {
      name: 'AutoRevive',
      short_name: 'AutoRevive',
      description: 'Modern car listing platform',

      theme_color: '#f97316',
      background_color: '#000000',

      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',

      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/pwa-180x180.png',
          sizes: '180x180',
          type: 'image/png'
        }
      ]
    },

    devOptions: {
      enabled: true,
      suppressWarnings: true
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